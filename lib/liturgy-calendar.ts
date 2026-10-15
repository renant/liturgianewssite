import { civilDateToIso, MONTH_NAMES, type CivilDate } from "./liturgical-date";

export function calendarHref(date: Pick<CivilDate, "year" | "month">) {
  return `/liturgia/calendario/${date.year}/${MONTH_NAMES[date.month - 1]}`;
}

export function calendarMonthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function buildMonthWeeks(year: number, month: number): Array<Array<CivilDate | null>> {
  if (!Number.isInteger(year) || year < 1000 || year > 9999 || !Number.isInteger(month) || month < 1 || month > 12) throw new Error("Mês inválido");
  const start = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((start + total) / 7) }, (_, week) => Array.from({ length: 7 }, (_, weekday) => {
    const day = week * 7 + weekday - start + 1;
    return day < 1 || day > total ? null : { year, month, day };
  }));
}

export function getCalendarMonths(entries: Array<{ date: string }>) {
  const keys = [...new Set(entries.map(({ date }) => date.slice(0, 7)))].sort();
  return keys.map(key => {
    const [year, month] = key.split("-").map(Number);
    return { year, month, key, label: calendarMonthLabel(year, month), href: calendarHref({ year, month }) };
  });
}

export function adjacentMonth(year: number, month: number, offset: number) {
  const next = new Date(Date.UTC(year, month - 1 + offset, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
}

export function monthContainsDate(year: number, month: number, date: string) {
  return date.slice(0, 7) === civilDateToIso({ year, month, day: 1 }).slice(0, 7);
}
