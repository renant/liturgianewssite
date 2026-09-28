export type LiturgyFacts = { gospel?: string; firstReading?: string };

function cleanReference(value: string): string {
  return value.replace(/\*+/g, "").replace(/\s+/g, " ").trim();
}

export function extractLiturgyFacts(source: string): LiturgyFacts {
  const gospel = /Evangelho\s*\(([^)\n]+)\)/i.exec(source)?.[1];
  const firstReading = /Primeira Leitura[\s*]*\([\s*]*([^)\n]+)[\s*]*\)/i.exec(source)?.[1];
  return {
    gospel: gospel ? cleanReference(gospel) : undefined,
    firstReading: firstReading ? cleanReference(firstReading) : undefined,
  };
}

export function buildLiturgyDescription(title: string, formattedDate: string, facts: LiturgyFacts) {
  return [
    `Liturgia diária de ${formattedDate}, ${title}.`,
    facts.gospel ? `Evangelho ${facts.gospel}.` : "",
    facts.firstReading ? `Primeira leitura: ${facts.firstReading}.` : "",
  ].filter(Boolean).join(" ");
}
