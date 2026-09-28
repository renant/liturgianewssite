import { getContentIndex } from "@/lib/content-metadata";

interface Params { limit?: number; page?: number; searchTerm?: string; sort?: string }

export interface LiturgiaMetadata {
  title: string;
  slug: string;
  date: string;
  formattedDate: string;
  dayOfWeek: string;
}

export async function getLiturgia({ limit, page, searchTerm, sort = "date_asc" }: Params) {
  let liturgias: LiturgiaMetadata[] = getContentIndex("liturgia-content").map((entry) => ({
    title: entry.title,
    slug: entry.slug,
    date: entry.date,
    formattedDate: entry.formattedDate,
    dayOfWeek: entry.dayOfWeek,
  }));

  if (searchTerm?.trim()) {
    const query = searchTerm.toLocaleLowerCase("pt-BR");
    liturgias = liturgias.filter((item) => item.title.toLocaleLowerCase("pt-BR").includes(query));
  }

  const totalLiturgias = liturgias.length;
  const [sortBy, sortOrder] = sort.split("_");
  if (sortBy === "date") {
    liturgias.sort((a, b) => sortOrder === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }

  const start = ((page ?? 1) - 1) * (limit ?? 10);
  if (limit) liturgias = liturgias.slice(start, start + limit);
  return { liturgias, totalLiturgias };
}
