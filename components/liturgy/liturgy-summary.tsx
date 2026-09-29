import type { LiturgyFacts } from "@/lib/liturgy-facts";

export function LiturgySummary({ formattedDate, facts, isToday }: { formattedDate: string; facts: LiturgyFacts; isToday: boolean }) {
  return (
    <dl className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-slate-700">
      <div><dt className="sr-only">Data</dt><dd className="font-semibold">{isToday ? `Liturgia de hoje — ${formattedDate}` : `Liturgia de ${formattedDate}`}</dd></div>
      {facts.gospel && <div className="mt-2"><dt className="inline font-medium">Evangelho: </dt><dd className="inline">{facts.gospel}</dd></div>}
      {facts.firstReading && <div className="mt-1"><dt className="inline font-medium">Primeira leitura: </dt><dd className="inline">{facts.firstReading}</dd></div>}
    </dl>
  );
}
