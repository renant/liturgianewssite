import fs from "node:fs";
import path from "node:path";
import { htmlToMarkdown } from "./future-liturgy-format.mjs";

const baseUrl = "https://liturgia.cancaonova.com";
const outputDirectory = path.join(process.cwd(), "liturgia-content");
const monthNames = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const sourceMonths = {
  jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6,
  jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12,
};

function todayInSaoPaulo(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (key) => Number(parts.find((part) => part.type === key)?.value);
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
}

function parseDaysAhead() {
  const argument = process.argv.find((value) => value.startsWith("--days="));
  const input = argument?.slice("--days=".length) ?? process.env.DAYS_AHEAD ?? "7";
  const days = Number(input);
  if (!Number.isInteger(days) || days < 1 || days > 30) {
    throw new Error("DAYS_AHEAD deve ser um número inteiro entre 1 e 30.");
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

async function getHtml(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "LiturgiaNews/1.0 (+https://www.liturgianews.site)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Fonte respondeu ${response.status}: ${url}`);
  return response.text();
}

async function sourceUrlFor(date) {
  const calendarUrl = new URL("/pb/", baseUrl);
  calendarUrl.searchParams.set("sAno", String(date.getUTCFullYear()));
  calendarUrl.searchParams.set("sMes", String(date.getUTCMonth() + 1));
  const calendarHtml = await getHtml(calendarUrl);
  const calendar = elementById(calendarHtml, "wp-calendar", "table");
  if (!calendar) throw new Error(`Calendário da fonte não encontrado para ${isoDate(date)}.`);

  for (const match of calendar.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const url = new URL(decodeHtml(match[1]), baseUrl);
    const params = url.searchParams;
    if (Number(params.get("sAno")) === date.getUTCFullYear()
      && Number(params.get("sMes")) === date.getUTCMonth() + 1
      && Number(params.get("sDia")) === date.getUTCDate()) return url;
  }

  // O calendário visual pode continuar no mês atual mesmo quando a liturgia
  // consultada já é de outro mês. Tenta a consulta direta por data antes de
  // concluir que a fonte ainda não publicou o conteúdo. buildMdx valida a data
  // retornada, então uma resposta padrão ou incorreta continua sendo rejeitada.
  const dateUrl = new URL("/pb/", baseUrl);
  dateUrl.searchParams.set("sDia", String(date.getUTCDate()));
  dateUrl.searchParams.set("sMes", String(date.getUTCMonth() + 1));
  dateUrl.searchParams.set("sAno", String(date.getUTCFullYear()));
  console.info(`Dia ausente no calendário; tentando consulta direta: ${isoDate(date)}`);
  return dateUrl;
}

async function buildMdx(date, publishedAt) {
  const sourceUrl = await sourceUrlFor(date);
  const html = await getHtml(sourceUrl);
  const actualDay = Number(/<span\b[^>]*id=["']dia-calendar["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)?.[1]?.replace(/<[^>]+>/g, "").trim());
  const actualMonthKey = /<span\b[^>]*id=["']mes-calendar["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)?.[1]?.replace(/<[^>]+>/g, "").trim().toLowerCase().slice(0, 3);
  const actualYear = Number(/<span\b[^>]*id=["']ano-calendar["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)?.[1]?.replace(/<[^>]+>/g, "").trim());
  if (actualDay !== date.getUTCDate() || sourceMonths[actualMonthKey] !== date.getUTCMonth() + 1 || actualYear !== date.getUTCFullYear()) {
    throw new Error(`Data da página da fonte não corresponde a ${isoDate(date)}.`);
  }

  const title = /<h1\b[^>]*class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1]
    ?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (!title) throw new Error(`Título litúrgico ausente para ${isoDate(date)}.`);

  const readings = [];
  for (let index = 1; index <= 8; index += 1) {
    const section = elementById(html, `liturgia-${index}`);
    if (!section) continue;
    const markdown = htmlToMarkdown(section);
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

async function main() {
  const daysAhead = parseDaysAhead();
  const today = todayInSaoPaulo();
  fs.mkdirSync(outputDirectory, { recursive: true });
  const failures = [];
  let created = 0;
  let updated = 0;

  for (let offset = 1; offset <= daysAhead; offset += 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + offset);
    const slug = slugFor(date);
    const filePath = path.join(outputDirectory, `${slug}.mdx`);
    const existed = fs.existsSync(filePath);
    let publishedAt;
    if (existed) {
      const existing = fs.readFileSync(filePath, "utf8");
      publishedAt = /publishedAt:\s*['"]([^'"]+)['"]/.exec(existing)?.[1];
      const isComplete = /##\s+(reflex[aã]o|not[ií]cias)/i.test(existing);
      if (!process.argv.includes("--refresh-existing") || isComplete) {
        console.info(`Já existe; mantendo sem alteração: ${slug}`);
        continue;
      }
    }
    try {
      const mdx = await buildMdx(date, publishedAt);
      fs.writeFileSync(filePath, mdx);
      console.info(`Liturgia futura ${existed ? "atualizada" : "criada"}: ${slug}`);
      if (existed) updated += 1;
      else created += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Não foi possível criar ${slug}: ${message}`);
      failures.push(slug);
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  console.info(`Execução concluída: ${created} criada(s), ${updated} atualizada(s), ${failures.length} pendente(s).`);
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
