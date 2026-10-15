import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getContentIndex } from "@/lib/content-metadata";
import { addCivilDays, civilDateToSlug, formatCivilDate } from "@/lib/liturgical-date";

export function AdjacentDays({ date, afterReading = false }: { date: string; afterReading?: boolean }) {
  const slugs = new Set(getContentIndex("liturgia-content").map(entry => entry.slug));
  const previous = addCivilDays(date, -1);
  const next = addCivilDays(date, 1);
  if (!slugs.has(civilDateToSlug(previous)) && !slugs.has(civilDateToSlug(next))) return null;
  return <nav aria-label={afterReading ? "Continuar para outra liturgia" : "Navegação entre dias"} className={`adjacent-days${afterReading ? " after-reading" : ""}`}>
    {slugs.has(civilDateToSlug(previous)) ? <Link href={`/liturgia/${civilDateToSlug(previous)}`} aria-label={`Dia anterior: ${formatCivilDate(previous)}`} rel="prev"><ArrowLeft className="size-4" aria-hidden="true" />Anterior</Link> : <span />}
    {slugs.has(civilDateToSlug(next)) ? <Link href={`/liturgia/${civilDateToSlug(next)}`} aria-label={`Próximo dia: ${formatCivilDate(next)}`} rel="next">Próximo<ArrowRight className="size-4" aria-hidden="true" /></Link> : <span />}
  </nav>;
}
