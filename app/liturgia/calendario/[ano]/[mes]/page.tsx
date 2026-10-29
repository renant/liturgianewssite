import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiturgyCalendar } from "@/components/liturgy/calendar";
import { getContentIndex } from "@/lib/content-metadata";
import { calendarHref, calendarMonthLabel, getCalendarMonths } from "@/lib/liturgy-calendar";
import { getLiturgicalDate, MONTH_NAMES } from "@/lib/liturgical-date";
import { decodeRouteSegment } from "@/lib/route-segment";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ ano: string; mes: string }> };
export const revalidate = 300;

function resolveMonth(ano: string, mes: string) {
  const year = Number(ano);
  const month = MONTH_NAMES.indexOf(decodeRouteSegment(mes) as (typeof MONTH_NAMES)[number]) + 1;
  if (!getCalendarMonths(getContentIndex("liturgia-content")).some(item => item.year === year && item.month === month)) notFound();
  return { year, month };
}

export function generateStaticParams() {
  return getCalendarMonths(getContentIndex("liturgia-content")).map(({ year, month }) => ({ ano: String(year), mes: MONTH_NAMES[month - 1] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ano, mes } = await params;
  const { year, month } = resolveMonth(ano, mes);
  const label = calendarMonthLabel(year, month);
  return buildPageMetadata({
    title: `Calendário litúrgico de ${label}`,
    description: `Consulte as leituras das liturgias disponíveis em ${label}. Escolha uma data no calendário para abrir a liturgia.`,
    path: calendarHref({ year, month }),
  });
}

export default async function Page({ params }: Props) {
  const { ano, mes } = await params;
  const { year, month } = resolveMonth(ano, mes);
  return <LiturgyCalendar year={year} month={month} today={getLiturgicalDate().iso} entries={getContentIndex("liturgia-content")} />;
}

export const dynamicParams = false;
