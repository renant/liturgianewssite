import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { getContentIndex } from "@/lib/content-metadata";
import { MONTH_NAMES } from "@/lib/liturgical-date";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ ano: string; mes: string }> };

function monthGroups() {
  const groups = new Map<string, ReturnType<typeof getContentIndex>>();
  for (const entry of getContentIndex("liturgia-content")) {
    const [year, month] = entry.date.split("-").map(Number);
    const key = `${year}/${MONTH_NAMES[month - 1]}`;
    groups.set(key, [...(groups.get(key) || []), entry]);
  }
  return groups;
}

export function generateStaticParams() {
  return Array.from(monthGroups().keys()).map((key) => {
    const [ano, mes] = key.split("/");
    return { ano, mes };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ano, mes } = await params;
  const title = `Calendário litúrgico de ${mes} de ${ano}`;
  return { title, description: `Liturgias disponíveis em ${mes} de ${ano}, com acesso às leituras e à reflexão de cada dia.`, alternates: { canonical: `https://www.liturgianews.site/liturgia/calendario/${ano}/${mes}` } };
}

export default async function CalendarPage({ params }: Props) {
  const { ano, mes } = await params;
  const monthIndex = MONTH_NAMES.indexOf(mes as (typeof MONTH_NAMES)[number]);
  const entries = monthGroups().get(`${ano}/${mes}`) || [];
  const byDay = new Map(entries.map((entry) => [Number(entry.date.slice(8, 10)), entry]));
  const days = monthIndex >= 0 ? new Date(Date.UTC(Number(ano), monthIndex + 1, 0)).getUTCDate() : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Liturgia", href: "/liturgia" }, { label: "Calendário", href: `/liturgia/calendario/${ano}/${mes}` }]} />
      <header className="space-y-3"><h1 className="text-3xl font-serif font-bold text-slate-900">Calendário litúrgico de {mes} de {ano}</h1><p className="text-slate-600">Selecione um dia publicado para abrir a liturgia completa.</p></header>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: days }, (_, index) => index + 1).map((day) => {
          const entry = byDay.get(day);
          return <li key={day} className="min-h-24 rounded-lg border border-amber-200 bg-white p-4">
            <span className="block text-sm font-semibold text-slate-500">{day} de {mes}</span>
            {entry ? <Link href={`/liturgia/${entry.slug}`} className="mt-2 block font-medium text-amber-800 underline underline-offset-4">{entry.title}</Link> : <span className="mt-2 block text-sm text-slate-400">Sem liturgia publicada</span>}
          </li>;
        })}
      </ol>
    </div>
  );
}

export const dynamicParams = false;
