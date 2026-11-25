import { getLiturgyEntry } from "@/lib/content-metadata";
import { civilDateToSlug, getLiturgicalCivilDate, getNextSunday } from "@/lib/liturgical-date";

// Calculado a cada request (America/Sao_Paulo). Redirect temporário: o destino muda toda semana.
export const dynamic = "force-dynamic";

export function GET() {
  const slug = civilDateToSlug(getNextSunday(getLiturgicalCivilDate()));
  const location = getLiturgyEntry(slug) ? `/liturgia/${slug}` : "/liturgia";
  return new Response(null, {
    status: 307,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}
