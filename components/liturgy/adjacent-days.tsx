import { addCivilDays, civilDateToSlug, formatCivilDate } from "@/lib/liturgical-date";
import fs from "node:fs";
import Link from "next/link";
import path from "node:path";

export function AdjacentDays({ date }: { date: string }) {
  const candidates = [
    { label: "Dia anterior", date: addCivilDays(date, -1) },
    { label: "Próximo dia", date: addCivilDays(date, 1) },
  ].map((item) => ({ ...item, slug: civilDateToSlug(item.date) }));

  return (
    <nav aria-label="Navegação entre dias" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {candidates.map((item) => fs.existsSync(path.join(process.cwd(), "liturgia-content", `${item.slug}.mdx`)) ? (
        <Link key={item.label} href={`/liturgia/${item.slug}`} className="rounded-md border border-amber-200 bg-white p-3 text-amber-800 hover:bg-amber-50">
          <span className="block font-semibold">{item.label}</span>
          <span className="text-sm">{formatCivilDate(item.date)}</span>
        </Link>
      ) : <span key={item.label} />)}
    </nav>
  );
}
