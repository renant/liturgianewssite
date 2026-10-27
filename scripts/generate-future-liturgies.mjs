import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { htmlToMarkdown } from "./future-liturgy-format.mjs";

const baseUrl = "https://liturgia.cancaonova.com";
const outputDirectory = path.join(process.cwd(), "liturgia-content");
const monthNames = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const sourceMonths = {
  jan: 1, fev: 2, feb: 2, mar: 3, abr: 4, apr: 4, mai: 5, may: 5, jun: 6,
  jul: 7, ago: 8, aug: 8, set: 9, sep: 9, out: 10, oct: 10, nov: 11, dez: 12, dec: 12,
};

function todayInSaoPaulo(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (key) => Number(parts.find((part) => part.type === key)?.value);
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
}

export function parseDaysAhead(args = process.argv, env = process.env) {
  const argument = args.find((value) => value.startsWith("--days="));
  const input = argument?.slice("--days=".length) ?? env.DAYS_AHEAD ?? "7";
  const days = Number(input);
  if (!Number.isInteger(days) || days < 1 || days > 90) {
    throw new Error("DAYS_AHEAD deve ser um número inteiro entre 1 e 90.");
  }
  return days;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function slugFor(date) {
  return `${String(date.getUTCDate()).padStart(2, "0")}-${monthNames[date.getUTCMonth()]}-${date.getUTCFullYear()}`;
}

function elementById(html, id, tagName = "div") {
  const opening = new RegExp(`<${tagName}\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>`, "i").exec(html);
  if (!opening) return null;
  const tags = new RegExp(`<${tagName}\\b[^>]*>|<\\/${tagName}\\s*>`, "gi");
  tags.lastIndex = opening.index;
  let depth = 0;
  let match;
  while ((match = tags.exec(html))) {
    if (new RegExp(`^<${tagName}\\b`, "i").test(match[0])) depth += 1;
    else depth -= 1;
    if (depth === 0) return html.slice(opening.index + opening[0].length, tags.lastIndex - match[0].length);
  }
  return null;
}

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => named[name.toLowerCase()] ?? entity);
}

async function getHtml(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "User-Agent": "LiturgiaNews/1.0 (+https://www.liturgianews.site)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Fonte respondeu ${response.status}: ${url}`);
  return response.text();
}

async function sourceUrlFor(date) {
  // sMes/sAno na página inicial só alteram o widget. A navegação real entre
  // meses usa esta operação, também chamada pelo calendar.js da fonte.
  const calendarHtml = await getHtml(new URL("/wp-admin/admin-ajax.php", baseUrl), {
    method: "POST",
    body: new URLSearchParams({
      action: "widget-ajax", sAno: String(date.getUTCFullYear()),
      sMes: String(date.getUTCMonth() + 1), title: "", type: "liturgia", ajax: "true",
    }),
  });
  const calendar = elementById(calendarHtml, "wp-calendar", "table");
  if (!calendar) throw new Error(`Calendário da fonte não encontrado para ${isoDate(date)}.`);

  for (const match of calendar.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const url = new URL(decodeHtml(match[1]), baseUrl);
    if (url.origin !== baseUrl || !/^\/(?:pb\/)?liturgia\/[^/]+\/$/.test(url.pathname)) continue;
    const params = url.searchParams;
    if (Number(params.get("sAno")) === date.getUTCFullYear()
      && Number(params.get("sMes")) === date.getUTCMonth() + 1
      && Number(params.get("sDia")) === date.getUTCDate()) {
      if (!url.pathname.startsWith("/pb/")) url.pathname = `/pb${url.pathname}`;
      // A data do artigo deve vir do permalink, sem parâmetros que alterem o widget.
      url.search = "";
      url.hash = "";
      return url;
    }
  }

  throw new Error(`A fonte ainda não oferece link do calendário para ${isoDate(date)}.`);
}

export async function buildMdx(date, publishedAt) {
  const sourceUrl = await sourceUrlFor(date);
  const html = await getHtml(sourceUrl);
  // A fonte repete id="date-post" no widget e no artigo. O conteúdo principal
  // delimita a data publicada, independente da data selecionada no calendário.
  const content = elementById(html, "content", "section");
  const articleDate = content && elementById(content, "date-post");
  const datePart = (name) => new RegExp(`<span\\b[^>]*class=["'][^"']*\\b${name}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/span>`, "i")
    .exec(articleDate ?? "")?.[1]?.replace(/<[^>]+>/g, "").trim();
  const actualDay = Number(datePart("dia"));
  const actualMonthKey = datePart("mes")?.toLowerCase().slice(0, 3);
  const actualYear = Number(datePart("ano"));
  if (actualDay !== date.getUTCDate() || sourceMonths[actualMonthKey] !== date.getUTCMonth() + 1 || actualYear !== date.getUTCFullYear()) {
    throw new Error(`Data do artigo da fonte não corresponde a ${isoDate(date)}: ${sourceUrl}`);
  }

  const title = /<h1\b[^>]*class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i.exec(content)?.[1]
    ?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (!title) throw new Error(`Título litúrgico ausente para ${isoDate(date)}.`);

  const readings = [];
  for (let index = 1; index <= 8; index += 1) {
    const section = elementById(content, `liturgia-${index}`);
    if (!section) continue;
    const markdown = htmlToMarkdown(section.replace(/\r\n?/g, "\n")).replace(/[\t ]+$/gm, "");
    if (markdown) readings.push(markdown);
  }
  if (readings.length < 3) throw new Error(`Leituras incompletas para ${isoDate(date)}.`);

  const now = new Date().toISOString();
  const originalPublication = publishedAt ?? now;
  const longDate = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC", weekday: "long", day: "2-digit", month: "long", year: "numeric",
  }).format(date);
  return `export const metadata = { title: ${JSON.stringify(title)}, date: '${isoDate(date)}', publishedAt: '${originalPublication}', updatedAt: '${now}' };\n\n# ${title}\n\n${longDate}\n\n## Leituras do Dia\n\n${readings.join("\n\n")}\n`;
}

export async function generateLiturgies({
  daysAhead = parseDaysAhead(),
  today = todayInSaoPaulo(),
  directory = outputDirectory,
  refreshExisting = process.argv.includes("--refresh-existing"),
  delayMs = 800,
} = {}) {
  fs.mkdirSync(directory, { recursive: true });
  const failures = [];
  let created = 0;
  let updated = 0;

  for (let offset = 1; offset <= daysAhead; offset += 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + offset);
    const slug = slugFor(date);
    const filePath = path.join(directory, `${slug}.mdx`);
    const existed = fs.existsSync(filePath);
    let publishedAt;
    let existing;
    if (existed) {
      existing = fs.readFileSync(filePath, "utf8");
      publishedAt = /publishedAt:\s*['"]([^'"]+)['"]/.exec(existing)?.[1];
      if (!refreshExisting) {
        console.info(`Já existe; mantendo sem alteração: ${slug}`);
        continue;
      }
    }
    try {
      let mdx = await buildMdx(date, publishedAt);
      if (existing) {
        // Revalida as leituras sem descartar o conteúdo editorial da página.
        const editorialStart = existing.search(/^##\s+(?:reflex[aã]o|not[ií]cias)\b/im);
        if (editorialStart !== -1) mdx = `${mdx.trimEnd()}\n\n${existing.slice(editorialStart)}`;
        const comparable = (value) => value.replace(/,?\s*(?:publishedAt|updatedAt):\s*['"][^'"]+['"]/g, "")
          .replace(/\r\n?/g, "\n").trimEnd();
        if (comparable(existing) === comparable(mdx)) {
          console.info(`Revalidada; mantendo sem alteração: ${slug}`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
      }
      fs.writeFileSync(filePath, mdx);
      console.info(`Liturgia futura ${existed ? "atualizada" : "criada"}: ${slug}`);
      if (existed) updated += 1;
      else created += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Não foi possível criar ${slug}: ${message}`);
      failures.push(slug);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.info(`Execução concluída: ${created} criada(s), ${updated} atualizada(s), ${failures.length} pendente(s).`);
  return { created, updated, failures };
}

async function main() {
  const { failures } = await generateLiturgies();
  if (failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
