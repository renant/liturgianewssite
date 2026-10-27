import assert from "node:assert/strict";
import { mock, test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildMdx, generateLiturgies, parseDaysAhead } from "./generate-future-liturgies.mjs";

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
  assert.match(mdx, /date: '2026-11-01'/);
  assert.match(mdx, /publishedAt: '2026-10-26T10:00:00Z'/);
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
  const result = await generateLiturgies({ daysAhead: 2, today: new Date("2026-12-31T00:00:00Z"), directory, delayMs: 0, allowUnavailable: true });
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
  const result = await generateLiturgies({ daysAhead: 7, today: new Date("2026-10-31T00:00:00Z"), directory, refreshExisting: true, delayMs: 0 });
  assert.deepEqual(result, { created: 4, updated: 1, pending: [], failures: ["03-novembro-2026"] });
  const repaired = fs.readFileSync(filename(1), "utf8");
  assert.match(repaired, /Primeira leitura de segunda-feira/);
  assert.match(repaired, /publishedAt: '2026-10-20T10:00:00Z'/);
  assert.ok(repaired.endsWith(editorial));
  assert.equal(fs.readFileSync(filename(2), "utf8"), unchanged);
  assert.equal(fs.readFileSync(filename(3), "utf8"), "Página preservada se a fonte falhar.");
  assert.equal(fs.readFileSync(filename(8), "utf8"), "Fora do intervalo.");
  assert.equal(fs.readFileSync(path.join(directory, "31-outubro-2026.mdx"), "utf8"), "Hoje.");
});

test("geração de 90 dias atravessa o ano e mantém páginas existentes", async (t) => {
  const fetchMock = mockFutureSource(t);
  const directory = temporaryDirectory(t);
  const existingFile = path.join(directory, "01-novembro-2026.mdx");
  fs.writeFileSync(existingFile, "Página existente.");
  const result = await generateLiturgies({ daysAhead: 90, today: new Date("2026-10-31T00:00:00Z"), directory, refreshExisting: false, delayMs: 0 });
  assert.deepEqual(result, { created: 89, updated: 0, pending: [], failures: [] });
  assert.equal(fs.readdirSync(directory).length, 90);
  assert.equal(fs.readFileSync(existingFile, "utf8"), "Página existente.");
  assert.ok(fs.existsSync(path.join(directory, "29-janeiro-2027.mdx")));
  assert.ok(!fs.existsSync(path.join(directory, "30-janeiro-2027.mdx")));
  assert.equal(fetchMock.mock.callCount(), 178);
});
