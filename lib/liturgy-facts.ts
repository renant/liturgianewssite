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

// Domingo ainda por vir (ou hoje): description com a busca "evangelho do dia <data>".
export function isUpcomingSunday(isoDate: string, todayIso: string) {
  return isoDate >= todayIso && getDayOfWeek(isoDate) === 0;
}

export function isSunday(isoDate: string) {
  return getDayOfWeek(isoDate) === 0;
}

export function liturgyCelebrationName(title: string) {
  return title.split("|")[0].replace(/\s+-\s+(Festa|Solenidade|Memória)\s*$/i, "").trim();
}

// Molde aprovado: "Evangelho do dia [data]", com evangelho ou celebração se couber em cerca de 60 caracteres (teto 70).
const TITLE_CORE_MAX = 70;
const BRAND_SUFFIX = " | LiturgiaNews";
const TITLE_WITH_BRAND_MAX = 70;

export function buildLiturgyPageTitle(formattedDate: string, extras: Array<string | undefined> = []) {
  const base = `Evangelho do dia ${formattedDate}`;
  for (const extra of extras) {
    const value = extra?.trim();
    if (!value) continue;
    const withExtra = `${base}, ${value}`;
    if (withExtra.length <= TITLE_CORE_MAX) return withExtra;
  }
  return base;
}

export function liturgyDocumentTitle(core: string) {
  const branded = `${core}${BRAND_SUFFIX}`;
  return branded.length <= TITLE_WITH_BRAND_MAX ? branded : core;
}

export function buildSundayTitle(title: string, formattedDate: string, gospel?: string) {
  return buildLiturgyPageTitle(formattedDate, [liturgyCelebrationName(title), gospel]);
}

export function buildSundayDescription(title: string, formattedDate: string, facts: LiturgyFacts) {
  return [
    `Evangelho do dia ${formattedDate}, ${liturgyCelebrationName(title)}.`,
    facts.gospel ? `Evangelho ${facts.gospel}.` : "",
    "Leituras, salmo e reflexão do domingo.",
  ].filter(Boolean).join(" ");
}
