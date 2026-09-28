export const LITURGICAL_TIME_ZONE = "America/Sao_Paulo";

export const MONTH_NAMES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

export type CivilDate = { year: number; month: number; day: number };

const saoPauloDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: LITURGICAL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getLiturgicalCivilDate(date = new Date()): CivilDate {
  const parts = saoPauloDateFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: value("year"), month: value("month"), day: value("day") };
}

export function parseCivilDate(value: string): CivilDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Data civil inválida: ${value}`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function civilDateToIso(date: CivilDate): string {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function civilDateToSlug(date: CivilDate): string {
  return `${String(date.day).padStart(2, "0")}-${MONTH_NAMES[date.month - 1]}-${date.year}`;
}

export function formatCivilDate(value: string | CivilDate): string {
  const date = typeof value === "string" ? parseCivilDate(value) : value;
  return `${date.day} de ${MONTH_NAMES[date.month - 1]} de ${date.year}`;
}

export function getLiturgicalDate(date = new Date()) {
  const civilDate = getLiturgicalCivilDate(date);
  return {
    ...civilDate,
    iso: civilDateToIso(civilDate),
    slug: civilDateToSlug(civilDate),
    formatted: formatCivilDate(civilDate),
  };
}

export function addCivilDays(value: string | CivilDate, days: number): CivilDate {
  const date = typeof value === "string" ? parseCivilDate(value) : value;
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
}

export function getDayOfWeek(value: string | CivilDate): number {
  const date = typeof value === "string" ? parseCivilDate(value) : value;
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

export function getNextSunday(value: string | CivilDate): CivilDate {
  const weekday = getDayOfWeek(value);
  return addCivilDays(value, weekday === 0 ? 0 : 7 - weekday);
}
