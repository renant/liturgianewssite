/** Plain text shared by the MDX transform and the factual metadata reader. */
const HTML_ENTITIES = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  oacute: "ó",
  Oacute: "Ó",
  aacute: "á",
  Aacute: "Á",
  eacute: "é",
  Eacute: "É",
  iacute: "í",
  Iacute: "Í",
  uacute: "ú",
  Uacute: "Ú",
  ccedil: "ç",
  Ccedil: "Ç",
  atilde: "ã",
  Atilde: "Ã",
  otilde: "õ",
  Otilde: "Õ",
  acirc: "â",
  Acirc: "Â",
  ecirc: "ê",
  Ecirc: "Ê",
  ocirc: "ô",
  Ocirc: "Ô",
  agrave: "à",
  Agrave: "À",
  uuml: "ü",
  Uuml: "Ü",
  ordf: "ª",
  ordm: "º",
  mdash: "—",
  ndash: "–",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
};

export function normalizeLiturgyText(value) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&([a-zA-Z]+);/g, (match, name) => HTML_ENTITIES[name] ?? match)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseReadingHeading(value) {
  const text = normalizeLiturgyText(value);
  const match = /^(Primeira Leitura|Segunda Leitura|Evangelho|Responsório|Salmo Responsorial)\s*(.*)$/i.exec(text);
  if (!match) return null;
  const reference = match[2].replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").trim();
  if (!reference || reference.length > 150) return null;
  const key = match[1].toLocaleLowerCase("pt-BR");
  const id = key === "primeira leitura" ? "primeira-leitura" : key === "segunda leitura" ? "segunda-leitura" : key === "evangelho" ? "evangelho" : "salmo";
  if (id === "salmo" ? !/^(?:\d\s*)?[A-Za-zÀ-ÿ]+\s*\d/.test(reference) : !/^\([^)]*\d[^)]*\)$/.test(reference)) return null;
  const label = { "primeira-leitura": "Primeira leitura", "segunda-leitura": "Segunda leitura", evangelho: "Evangelho", salmo: "Salmo responsorial" }[id];
  return { id, label, reference, text: `${label} ${reference}` };
}

export function liturgySectionId(value) {
  const title = normalizeLiturgyText(value).toLocaleLowerCase("pt-BR");
  if (title === "leituras do dia") return "leituras";
  if (title === "reflexão do evangelho") return "reflexao";
  if (title === "notícias do vaticano") return "noticias";
  return null;
}
