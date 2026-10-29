import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getContentSlugSet } from "@/lib/content-metadata";
import { addCivilDays, civilDateToSlug, formatCivilDate } from "@/lib/liturgical-date";

export function AdjacentDays({ date, afterReading = false }: { date: string; afterReading?: boolean }) {
  const slugs = getContentSlugSet("liturgia-content");
  const previous = addCivilDays(date, -1);
  const next = addCivilDays(date, 1);
  const previousSlug = civilDateToSlug(previous);
  const nextSlug = civilDateToSlug(next);
  if (!slugs.has(previousSlug) && !slugs.has(nextSlug)) return null;
  return <nav aria-label={afterReading ? "Continuar para outra liturgia" : "Navegação entre dias"} className={`adjacent-days${afterReading ? " after-reading" : ""}`}>
    {slugs.has(previousSlug) ? <Link href={`/liturgia/${previousSlug}`} aria-label={`Dia anterior: ${formatCivilDate(previous)}`} rel="prev"><ArrowLeft className="size-4" aria-hidden="true" />Anterior</Link> : <span />}
    {slugs.has(nextSlug) ? <Link href={`/liturgia/${nextSlug}`} aria-label={`Próximo dia: ${formatCivilDate(next)}`} rel="next">Próximo<ArrowRight className="size-4" aria-hidden="true" /></Link> : <span />}
  </nav>;
}
