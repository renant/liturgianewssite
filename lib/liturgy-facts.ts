import { normalizeLiturgyText } from "./liturgy-markup.mjs";

export type LiturgyFacts = { gospel?: string; firstReading?: string };

export function extractLiturgyFacts(source: string): LiturgyFacts {
  const text = normalizeLiturgyText(source);
  const gospel = /Evangelho\s*\(([^)]+)\)/i.exec(text)?.[1];
  const firstReading = /Primeira Leitura\s*\(([^)]+)\)/i.exec(text)?.[1];
  return {
    gospel: gospel?.trim(),
    firstReading: firstReading?.trim(),
  };
}

export function buildLiturgyDescription(title: string, formattedDate: string, facts: LiturgyFacts) {
  return [
    `Liturgia diária de ${formattedDate}, ${title}.`,
    facts.gospel ? `Evangelho ${facts.gospel}.` : "",
    facts.firstReading ? `Primeira leitura: ${facts.firstReading}.` : "",
  ].filter(Boolean).join(" ");
}
