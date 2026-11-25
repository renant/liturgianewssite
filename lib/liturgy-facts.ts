import { getDayOfWeek } from "./liturgical-date";
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

// Domingo ainda por vir (ou hoje): title e description com a busca "evangelho do dia <data>".
export function isUpcomingSunday(isoDate: string, todayIso: string) {
  return isoDate >= todayIso && getDayOfWeek(isoDate) === 0;
}

export function liturgyCelebrationName(title: string) {
  return title.split("|")[0].replace(/\s+-\s+(Festa|Solenidade|Memória)\s*$/i, "").trim();
}

export function buildSundayTitle(title: string, formattedDate: string) {
  return `Evangelho do dia ${formattedDate}, ${liturgyCelebrationName(title)}`;
}

export function buildSundayDescription(title: string, formattedDate: string, facts: LiturgyFacts) {
  return [
    `Evangelho do dia ${formattedDate}, ${liturgyCelebrationName(title)}.`,
    facts.gospel ? `Evangelho ${facts.gospel}.` : "",
    "Leituras, salmo e reflexão do domingo.",
  ].filter(Boolean).join(" ");
}
