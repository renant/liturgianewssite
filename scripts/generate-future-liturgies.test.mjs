import assert from "node:assert/strict";
import { mock, test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildMdx, generateLiturgies, parseDaysAhead, parseForceReflection } from "./generate-future-liturgies.mjs";
import { attachReflection } from "./generate-future-liturgies.mjs";
import { extractReadingsReferences, findGospelReferenceMismatches, generateLiturgyReflection, validateReflection } from "./generate-liturgy-reflection.mjs";

const validReflection = `${Array.from({ length: 80 }, (_, index) => `palavra${index}`).join(" ")}\n\n${Array.from({ length: 80 }, (_, index) => `texto${index}`).join(" ")}`;
const fakeReflectionGenerator = async () => ({ text: validReflection, model: "test-model" });

// Reproduz a resposta real de /pb/?sDia=...: a data do widget muda,
// mas o artigo e suas leituras continuam sendo os de 26 de outubro.
function homepageWithSelectedDate(day) {
  return `<link rel="canonical" href="https://liturgia.cancaonova.com/pb/">
    <div id="date-post"><span id="dia-calendar">${day}</span>
      <span id="mes-calendar">Nov</span><span id="ano-calendar">2026</span></div>
    <section id="content">
    <div id="date-post"><span class="dia">26</span>
      <span class="mes">Oct</span><span class="ano">2026</span></div>
    <h1 class="entry-title">30ª Semana do Tempo Comum | Segunda-feira</h1>
    <div id="liturgia-1"><p>Primeira leitura de segunda-feira.</p></div>
    <div id="liturgia-2"><p>Salmo de segunda-feira.</p></div>
    <div id="liturgia-3"><p>Evangelho de segunda-feira.</p></div></section>`;
}

const calendarLink = '<table id="wp-calendar"><tbody><tr><td><a href="https://liturgia.cancaonova.com/liturgia/todos-os-santos-solenidade-domingo-2/?sDia=1&amp;sMes=11&amp;sAno=2026">1</a></td></tr></tbody></table>';

test("não publica o mesmo artigo para datas apenas alteradas no widget", async (t) => {
  t.after(() => mock.restoreAll());
  mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input);
    const day = url.searchParams.get("sDia");
    return new Response(day ? homepageWithSelectedDate(day) : '<table id="wp-calendar"><tbody><tr><td>1</td></tr></tbody></table>');
  });
  const results = await Promise.allSettled([1, 2].map((day) => buildMdx(new Date(Date.UTC(2026, 10, day)))));
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 0,
    "nenhuma data deve aceitar a liturgia da página inicial como seu próprio conteúdo");
});

test("rejeita um artigo de outro dia mesmo quando o widget mostra a data pedida", async (t) => {
  t.after(() => mock.restoreAll());
  mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input);
    return new Response(url.pathname.endsWith("admin-ajax.php") ? calendarLink : homepageWithSelectedDate(1));
  });
  await assert.rejects(buildMdx(new Date("2026-11-01T00:00:00Z")), /Data do artigo da fonte não corresponde/);
});

test("consulta o mês pelo AJAX e usa o permalink em português com a data do artigo", async (t) => {
  t.after(() => mock.restoreAll());
  const requests = [];
  mock.method(globalThis, "fetch", async (input, options) => {
    const url = new URL(input);
    requests.push(url.href);
    if (url.pathname.endsWith("admin-ajax.php")) {
      assert.equal(options.method, "POST");
      assert.deepEqual(Object.fromEntries(options.body), {
        action: "widget-ajax", sAno: "2026", sMes: "11", title: "", type: "liturgia", ajax: "true",
      });
      return new Response(calendarLink);
    }
    assert.equal(url.pathname, "/pb/liturgia/todos-os-santos-solenidade-domingo-2/");
    assert.equal(url.search, "");
    const article = homepageWithSelectedDate(26)
      .replace('<span class="dia">26</span>', '<span class="dia">01</span>')
      .replace('<span class="mes">Oct</span>', '<span class="mes">Nov</span>')
      .replace('Primeira leitura de segunda-feira.</p>', 'Primeira leitura de segunda-feira. &nbsp;\r\n</p>')
      .replace("30ª Semana do Tempo Comum | Segunda-feira", "Todos os Santos, Solenidade | Domingo");
    return new Response(article);
  });
  const mdx = await buildMdx(new Date("2026-11-01T00:00:00Z"), "2026-10-26T10:00:00Z");
  assert.match(mdx, /# Todos os Santos, Solenidade \| Domingo/);
  assert.match(mdx, /date: "2026-11-01"/);
  assert.match(mdx, /publishedAt: "2026-10-26T10:00:00Z"/);
  assert.doesNotMatch(mdx, /\r|[\t ]+\n/);
  assert.equal(requests.length, 2);
});

test("data ausente no artigo é rejeitada e não usa a data do widget como alternativa", async (t) => {
  t.after(() => mock.restoreAll());
  mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input);
    const article = homepageWithSelectedDate(1).replace(/<section id="content">[\s\S]*?<\/div>/, '<section id="content">');
    return new Response(url.pathname.endsWith("admin-ajax.php") ? calendarLink : article);
  });
  await assert.rejects(buildMdx(new Date("2026-11-01T00:00:00Z")), /Data do artigo da fonte não corresponde/);
});

function mockFutureSource(t, unavailableDay) {
  t.after(() => mock.restoreAll());
  return mock.method(globalThis, "fetch", async (input, options) => {
    const url = new URL(input);
    if (url.pathname.endsWith("admin-ajax.php")) {
      const year = options.body.get("sAno");
      const month = options.body.get("sMes");
      return new Response(`<table id="wp-calendar">${Array.from({ length: 31 }, (_, i) =>
        `<a href="/liturgia/dia-${year}-${month}-${i + 1}/?sDia=${i + 1}&amp;sMes=${month}&amp;sAno=${year}">${i + 1}</a>`).join("")}</table>`);
    }
    const [, year, month, day] = /dia-(\d+)-(\d+)-(\d+)/.exec(url.pathname);
    if (Number(day) === unavailableDay) return new Response("Indisponível", { status: 503 });
    const monthName = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })
      .format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
    return new Response(homepageWithSelectedDate(day)
      .replace('<span class="dia">26</span>', `<span class="dia">${day}</span>`)
      .replace('<span class="mes">Oct</span>', `<span class="mes">${monthName}</span>`)
      .replace('<span class="ano">2026</span>', `<span class="ano">${year}</span>`));
  });
}

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "future-liturgies-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

// Resposta minimizada do calendário real de janeiro/2027 em 27/10/2026:
// somente o dia 1 tem artigo; o dia 2 aparece como texto sem link.
const partialJanuaryCalendar = `<table id="wp-calendar"><tbody><tr>
  <td><a href="https://liturgia.cancaonova.com/liturgia/santa-maria-mae-de-deus-solenidade-sexta-feira/?sDia=1&sMes=1&sAno=2027">1</a></td>
  <td>2</td></tr></tbody></table>`;

test("geração longa deixa janeiro ainda sem artigo pendente, sem falhar nem publicar leitura repetida", async (t) => {
  t.after(() => mock.restoreAll());
  mock.method(globalThis, "fetch", async (input, options) => {
    if (new URL(input).pathname.endsWith("admin-ajax.php")) {
      assert.equal(options.body.get("sAno"), "2027");
      assert.equal(options.body.get("sMes"), "1");
      return new Response(partialJanuaryCalendar);
    }
    return new Response(homepageWithSelectedDate(1)
      .replace('<span class="dia">26</span>', '<span class="dia">1</span>')
      .replace('<span class="mes">Oct</span>', '<span class="mes">Jan</span>')
      .replace('<span class="ano">2026</span>', '<span class="ano">2027</span>'));
  });
  const directory = temporaryDirectory(t);
  const result = await generateLiturgies({ daysAhead: 2, today: new Date("2026-12-31T00:00:00Z"), directory, delayMs: 0, allowUnavailable: true, reflectionGenerator: fakeReflectionGenerator });
  assert.equal(result.created, 1);
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.pending, ["02-janeiro-2027"]);
  assert.deepEqual(fs.readdirSync(directory), ["01-janeiro-2027.mdx"]);
});

test("rotina diária continua falhando quando o calendário não oferece o dia", async (t) => {
  t.after(() => mock.restoreAll());
  mock.method(globalThis, "fetch", async () => new Response(partialJanuaryCalendar));
  const directory = temporaryDirectory(t);
  const file = path.join(directory, "02-janeiro-2027.mdx");
  fs.writeFileSync(file, "Conteúdo anterior.");
  const result = await generateLiturgies({ daysAhead: 1, today: new Date("2027-01-01T00:00:00Z"), directory, refreshExisting: true, delayMs: 0 });
  assert.deepEqual(result, { created: 0, updated: 0, pending: [], failures: ["02-janeiro-2027"] });
  assert.equal(fs.readFileSync(file, "utf8"), "Conteúdo anterior.");
});

for (const scenario of ["HTTP 503", "calendário inválido", "artigo de outro dia", "leituras incompletas"]) {
  test(`geração longa mantém falha real para ${scenario}`, async (t) => {
    t.after(() => mock.restoreAll());
    mock.method(globalThis, "fetch", async (input) => {
      if (scenario === "HTTP 503") return new Response("Falha", { status: 503 });
      if (new URL(input).pathname.endsWith("admin-ajax.php")) {
        return new Response(scenario === "calendário inválido" ? "Página inesperada" : calendarLink);
      }
      let article = homepageWithSelectedDate(1);
      if (scenario === "leituras incompletas") {
        article = article.replace('<span class="dia">26</span>', '<span class="dia">1</span>')
          .replace('<span class="mes">Oct</span>', '<span class="mes">Nov</span>')
          .replace(/<div id="liturgia-3">[\s\S]*?<\/div>/, "");
      }
      return new Response(article);
    });
    const directory = temporaryDirectory(t);
    const result = await generateLiturgies({ daysAhead: 1, today: new Date("2026-10-31T00:00:00Z"), directory, allowUnavailable: true, delayMs: 0 });
    assert.deepEqual(result, { created: 0, updated: 0, pending: [], failures: ["01-novembro-2026"] });
    assert.deepEqual(fs.readdirSync(directory), []);
  });
}

test("aceita até 90 dias e rejeita intervalos inválidos", () => {
  assert.equal(parseDaysAhead([], {}), 7);
  assert.equal(parseDaysAhead([], { DAYS_AHEAD: "90" }), 90);
  assert.equal(parseDaysAhead(["--days=7"], { DAYS_AHEAD: "90" }), 7);
  for (const input of ["0", "91", "1.5", "abc"]) {
    assert.throws(() => parseDaysAhead([], { DAYS_AHEAD: input }), /entre 1 e 90/);
  }
});

test("revalida só os próximos 7 dias, corrige leituras e preserva conteúdo editorial e publicação", async (t) => {
  mockFutureSource(t, 3);
  const directory = temporaryDirectory(t);
  const filename = (day) => path.join(directory, `0${day}-novembro-2026.mdx`);
  const valid = await buildMdx(new Date("2026-11-01T00:00:00Z"), "2026-10-20T10:00:00Z");
  const editorial = "## Reflexão do Evangelho\n\nReflexão original.\n\n## Notícias do Vaticano\n\nNotícia original.\n";
  fs.writeFileSync(filename(1), valid.replace("Primeira leitura de segunda-feira.", "Leitura incorreta.") + "\n" + editorial);
  const unchanged = await buildMdx(new Date("2026-11-02T00:00:00Z"), "2026-10-20T10:00:00Z");
  fs.writeFileSync(filename(2), unchanged);
  fs.writeFileSync(filename(3), "Página preservada se a fonte falhar.");
  fs.writeFileSync(filename(8), "Fora do intervalo.");
  fs.writeFileSync(path.join(directory, "31-outubro-2026.mdx"), "Hoje.");
  const result = await generateLiturgies({ daysAhead: 7, today: new Date("2026-10-31T00:00:00Z"), directory, refreshExisting: true, delayMs: 0, reflectionGenerator: fakeReflectionGenerator });
  assert.deepEqual(result, { created: 4, updated: 2, pending: [], failures: ["03-novembro-2026"] });
  const repaired = fs.readFileSync(filename(1), "utf8");
  assert.match(repaired, /Primeira leitura de segunda-feira/);
  assert.match(repaired, /publishedAt: "2026-10-20T10:00:00Z"/);
  assert.ok(repaired.endsWith(editorial));
  assert.match(fs.readFileSync(filename(2), "utf8"), /## Reflexão do Evangelho/);
  assert.match(fs.readFileSync(filename(2), "utf8"), /publishedAt: "2026-10-20T10:00:00Z"/);
  assert.equal(fs.readFileSync(filename(3), "utf8"), "Página preservada se a fonte falhar.");
  assert.equal(fs.readFileSync(filename(8), "utf8"), "Fora do intervalo.");
  assert.equal(fs.readFileSync(path.join(directory, "31-outubro-2026.mdx"), "utf8"), "Hoje.");
});

test("geração de 90 dias atravessa o ano e completa páginas sem reflexão", async (t) => {
  const fetchMock = mockFutureSource(t);
  const directory = temporaryDirectory(t);
  const existingFile = path.join(directory, "01-novembro-2026.mdx");
  fs.writeFileSync(existingFile, "Página existente.");
  const result = await generateLiturgies({ daysAhead: 90, today: new Date("2026-10-31T00:00:00Z"), directory, refreshExisting: false, delayMs: 0, reflectionGenerator: fakeReflectionGenerator });
  assert.deepEqual(result, { created: 89, updated: 1, pending: [], failures: [] });
  assert.equal(fs.readdirSync(directory).length, 90);
  assert.match(fs.readFileSync(existingFile, "utf8"), /## Reflexão do Evangelho/);
  assert.ok(fs.existsSync(path.join(directory, "29-janeiro-2027.mdx")));
  assert.ok(!fs.existsSync(path.join(directory, "30-janeiro-2027.mdx")));
  assert.equal(fetchMock.mock.callCount(), 180);
});

test("valida reflexão, extrai referências bíblicas e faz auto-correção quando a 1ª tentativa vem fora da faixa de palavras", async () => {
  assert.equal(validateReflection(validReflection.split("\n\n")), validReflection);
  assert.throws(() => validateReflection(["curta", "texto curto"]), /150 a 260 palavras/);
  assert.throws(() => validateReflection([validReflection, validReflection, validReflection]), /150 a 260 palavras/);
  assert.throws(() => validateReflection(["<p>tag html</p>", "segundo parágrafo"]), /2 a 3 parágrafos em prosa/);

  const refs = extractReadingsReferences(
    "<strong>Primeira Leitura</strong> (1Jo 3,22-4,6)\n\nTexto.\n\n<strong>Responsório</strong> Sl 2,7-8\n\n<strong>Evangelho</strong> (Mt 4,12-17.23-25)",
  );
  assert.equal(refs.firstReading, "1Jo 3,22-4,6");
  assert.equal(refs.gospel, "Mt 4,12-17.23-25");
  assert.doesNotMatch(refs.cleanReadingsText, /<strong>/);

  const requests = [];
  const result = await generateLiturgyReflection({
    date: "2026-11-09",
    title: "Memória",
    readings: "<strong>Primeira Leitura</strong> (1Jo 3,22-4,6)\n<strong>Evangelho</strong> (Mt 4,12-17)",
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body), headers: options.headers });
      const paragraphs =
        requests.length === 1
          ? ["Rascunho curto demais.", "Apenas duas frases."]
          : validReflection.split("\n\n");
      return new Response(
        JSON.stringify({
          status: "completed",
          output: [{ content: [{ type: "output_text", text: JSON.stringify({ paragraphs }) }] }],
        }),
      );
    },
  });
  assert.equal(result.text, validReflection);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, "https://api.openai.com/v1/responses");
  assert.equal(requests[0].headers.Authorization, "Bearer test-key");
  assert.equal(requests[0].body.text.format.type, "json_schema");
  assert.match(requests[0].body.input, /Evangelho do dia \(foco principal\): Mt 4,12-17/);
  assert.match(requests[1].body.input, /correção obrigatória/);
});

test("completa reflexão ausente, reaproveita a gerada e preserva reflexão editorial", async () => {
  const base = `export const metadata = { title: "Memória", date: '2026-11-01', publishedAt: '2026-10-20T10:00:00Z', updatedAt: '2026-10-20T10:00:00Z' };\n\n# Memória\n\n## Leituras do Dia\n\n<strong>Evangelho</strong> (Lc 1,1-4)\n\nTexto do Evangelho.\n\nSalmo responsorial.`;
  let calls = 0;
  const generator = async () => { calls += 1; return fakeReflectionGenerator(); };
  const generated = await attachReflection(base, null, { reflectionGenerator: generator });
  assert.match(generated, /## Reflexão do Evangelho/);
  assert.match(generated, /reflectionInputHash:/);
  assert.equal((await attachReflection(base, generated, { reflectionGenerator: generator }).then((value) => value.replace(/updatedAt: "[^"]+"/, 'updatedAt: "timestamp"'))), generated.replace(/updatedAt: "[^"]+"/, 'updatedAt: "timestamp"'));
  assert.equal(calls, 1);
  const editorial = `${base}\n\n## Reflexão do Evangelho\n\nReflexão escrita pela equipe.\n`;
  const preserved = await attachReflection(base, editorial, { reflectionGenerator: generator });
  assert.match(preserved, /Reflexão escrita pela equipe/);
  assert.equal(calls, 1);

  assert.equal(parseForceReflection([], {}), false);
  assert.equal(parseForceReflection(["--force-reflection"], {}), true);
  assert.equal(parseForceReflection([], { FORCE_REFLECTION: "true" }), true);

  const forcedFromGenerated = await attachReflection(base, generated, {
    reflectionGenerator: generator,
    forceReflection: true,
  });
  assert.equal(calls, 2);
  assert.match(forcedFromGenerated, /## Reflexão do Evangelho/);

  const forcedFromEditorial = await attachReflection(base, editorial, {
    reflectionGenerator: generator,
    forceReflection: true,
  });
  assert.equal(calls, 3);
  assert.doesNotMatch(forcedFromEditorial, /Reflexão escrita pela equipe/);
});

test("reflexão gerada precisa comentar o Evangelho das leituras do dia", async () => {
  assert.deepEqual(findGospelReferenceMismatches("Vigiai (Mc 13,33-37).", "Mc 13,33-37"), []);
  assert.deepEqual(findGospelReferenceMismatches("O Espírito virá sobre ti (Lc 1,35).", "Lc 1,26-38"), []);
  assert.deepEqual(findGospelReferenceMismatches("Missão (Mt 10,6).", "Mt 9,35–10,1.6-8"), []);
  assert.deepEqual(findGospelReferenceMismatches("Ver 1Jo 3,1.", "Jo 1,1-18"), []);
  assert.deepEqual(findGospelReferenceMismatches("Como nos dias de Noé (Mt 24,37-44).", "Mc 13,33-37"), ["Mt 24,37"]);
  assert.deepEqual(findGospelReferenceMismatches("José acolhe Maria (Mt 1,18-24).", "Lc 1,26-38"), ["Mt 1,18"]);
  assert.deepEqual(findGospelReferenceMismatches("Visitação (Lc 1,39-45).", "Lc 1,26-38"), ["Lc 1,39"]);

  // O Evangelho vem depois da Primeira Leitura, do Salmo e da Segunda Leitura, como nas páginas reais.
  const base = `export const metadata = { title: "1º Domingo do Advento", date: '2026-11-29', publishedAt: '2026-10-20T10:00:00Z', updatedAt: '2026-10-20T10:00:00Z' };\n\n# 1º Domingo do Advento\n\n## Leituras do Dia\n\n<strong>Primeira Leitura</strong> <strong>(Is 63,16b-17.19b;64,2b-7)</strong>\n\nTexto de Isaías.\n\n<strong>Responsório Sl 79(80),2ac.3b.15-16.18-19 (R. 4)</strong>\n\n<strong>Segunda Leitura</strong> <strong>(1Cor 1,3-9)</strong>\n\nTexto de Paulo.\n\nEvangelho <strong>(Mc 13,33-37)</strong>\n\nVigiai!`;
  const received = [];
  const reflectionAbout = (reference) => async ({ readings }) => {
    received.push(readings);
    return { text: validReflection.replace("palavra0", `(${reference})`), model: "test-model" };
  };
  const generated = await attachReflection(base, null, { reflectionGenerator: reflectionAbout("Mc 13,33-37") });
  assert.match(received[0], /Evangelho <strong>\(Mc 13,33-37\)<\/strong>/);
  assert.equal(extractReadingsReferences(received[0]).gospel, "Mc 13,33-37");
  assert.match(generated, /\(Mc 13,33-37\)/);
  await assert.rejects(
    attachReflection(base, null, { reflectionGenerator: reflectionAbout("Mt 24,37-44") }),
    /comenta Mt 24,37, mas o Evangelho do dia é Mc 13,33-37/,
  );
});
