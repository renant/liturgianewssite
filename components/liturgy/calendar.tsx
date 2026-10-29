import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import type { ContentIndexEntry } from "@/lib/content-metadata";
import { adjacentMonth, buildMonthWeeks, calendarHref, calendarMonthLabel, getCalendarMonths, monthContainsDate } from "@/lib/liturgy-calendar";
import { civilDateToIso, formatCivilDate, MONTH_NAMES } from "@/lib/liturgical-date";

const weekdays = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const shortWeekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function LiturgyCalendar({ year, month, entries, today, isIndex = false }: {
  year: number; month: number; entries: ContentIndexEntry[]; today: string; isIndex?: boolean;
}) {
  const months = getCalendarMonths(entries);
  const monthEntries = entries.filter(entry => monthContainsDate(year, month, entry.date));
  const byDate = new Map(monthEntries.map(entry => [entry.date, entry]));
  const label = calendarMonthLabel(year, month);
  const previous = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);
  const available = (candidate: { year: number; month: number }) => months.some(item => item.year === candidate.year && item.month === candidate.month);
  const years = [...new Set(months.map(item => item.year))].reverse();
  const url = `https://www.liturgianews.site${isIndex ? "/liturgia" : calendarHref({ year, month })}`;
  return <div className="page-container">
    {!isIndex && <Breadcrumbs items={[{ label: "Calendário", href: "/liturgia" }, { label, href: calendarHref({ year, month }) }]} />}
    <header className="calendar-heading">
      <div><p className="eyebrow">Liturgia diária</p><h1 className="page-title">Calendário litúrgico{!isIndex && <span className="sr-only"> de {label}</span>}</h1><p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">Encontre as leituras de hoje ou escolha uma data para acompanhar a liturgia.</p></div>
      <Link href="/liturgia/hoje" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200"><BookOpen className="size-4" aria-hidden="true" />Abrir a liturgia de hoje<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
    </header>
    <section aria-label={`Dias de ${label}`}>
      <div className="calendar-toolbar">
        <div className="flex items-center gap-2 sm:gap-4">
          <h2 className="calendar-month"><span className="capitalize">{MONTH_NAMES[month - 1]}</span> <span className="font-normal text-slate-600">{year}</span></h2>
          <nav aria-label="Navegação entre meses" className="calendar-navigation">
            {available(previous) ? <Link className="calendar-arrow" href={calendarHref(previous)} aria-label={`Mês anterior: ${calendarMonthLabel(previous.year, previous.month)}`}><ChevronLeft className="size-5" aria-hidden="true" /></Link> : <span className="calendar-arrow" aria-disabled="true"><ChevronLeft className="size-5" aria-hidden="true" /><span className="sr-only">Mês anterior indisponível</span></span>}
            {available(next) ? <Link className="calendar-arrow" href={calendarHref(next)} aria-label={`Próximo mês: ${calendarMonthLabel(next.year, next.month)}`}><ChevronRight className="size-5" aria-hidden="true" /></Link> : <span className="calendar-arrow" aria-disabled="true"><ChevronRight className="size-5" aria-hidden="true" /><span className="sr-only">Próximo mês indisponível</span></span>}
          </nav>
        </div>
        <details className="calendar-picker"><summary>Mês e ano<ChevronDown className="size-4" aria-hidden="true" /></summary><nav aria-label="Escolher mês e ano">
          {years.map(y => <div key={y}><h3>{y}</h3><ul>{months.filter(item => item.year === y).map(item => <li key={item.key}><Link href={item.href} aria-current={item.year === year && item.month === month ? "page" : undefined}>{MONTH_NAMES[item.month - 1]}</Link></li>)}</ul></div>)}
        </nav></details>
      </div>
      <table className="calendar-table">
        <caption className="sr-only">Calendário litúrgico de {label}. Selecione um dia disponível para abrir a liturgia.</caption>
        <thead><tr>{weekdays.map((name, i) => <th key={name} scope="col"><abbr title={name}>{shortWeekdays[i]}</abbr></th>)}</tr></thead>
        <tbody>{buildMonthWeeks(year, month).map((week, i) => <tr key={i}>{week.map((date, j) => {
          if (!date) return <td key={`blank-${j}`} />;
          const iso = civilDateToIso(date);
          const entry = byDate.get(iso);
          const isToday = today === iso;
          const content = <><time dateTime={iso} className="calendar-number">{date.day}</time>{isToday && <span className="calendar-today">Hoje</span>}{entry && <span className="calendar-celebration">{entry.title.split("|")[0].trim()}</span>}</>;
          return <td key={iso}>{entry
            ? <Link href={`/liturgia/${entry.slug}`} className="calendar-day" aria-label={`${formatCivilDate(date)} — ${entry.title}`} aria-current={isToday ? "date" : undefined}>{content}</Link>
            : <span className="calendar-day calendar-unavailable" aria-current={isToday ? "date" : undefined}>{content}<span className="sr-only"> — liturgia de {formatCivilDate(date)} indisponível</span></span>}</td>;
        })}</tr>)}</tbody>
      </table>
      <p className="calendar-legend"><span>Hoje está destacado em âmbar.</span><span>Dias sem link ainda não têm liturgia disponível.</span></p>
      {monthEntries.length === 0 && <p className="mt-6 text-sm leading-relaxed text-slate-600">Não há liturgias disponíveis neste mês.{months.length > 0 && <> Você pode consultar <Link className="text-link" href={months.at(-1)!.href}>{months.at(-1)!.label}</Link> ou escolher outro mês.</>}</p>}
    </section>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: `Calendário litúrgico de ${label}`, url, inLanguage: "pt-BR", mainEntity: { "@type": "ItemList", itemListElement: [...monthEntries].sort((a,b) => a.date.localeCompare(b.date)).map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: `Liturgia de ${entry.formattedDate}`, url: `https://www.liturgianews.site/liturgia/${entry.slug}` })) } }} />
  </div>;
}
