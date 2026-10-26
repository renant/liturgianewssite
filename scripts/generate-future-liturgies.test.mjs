import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { buildMdx } from "./generate-future-liturgies.mjs";

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
