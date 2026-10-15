/** Plain text shared by the MDX transform and the factual metadata reader. */
export function normalizeLiturgyText(value) {
  const entities = { nbsp: " ", amp: "&", oacute: "ó", Oacute: "Ó", aacute: "á", eacute: "é", iacute: "í", uacute: "ú", ccedil: "ç", atilde: "ã", otilde: "õ" };
  return value.replace(/<[^>]*>/g, "").replace(/&([a-zA-Z]+);/g, (match, name) => entities[name] ?? match)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\*+/g, "").replace(/\s+/g, " ").trim();
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
