import fs from "node:fs";
import path from "node:path";

interface Params {
  limit?: number;
  page?: number;
  searchTerm?: string;
  sort?: string;
}

export interface LiturgiaMetadata {
  title: string;
  slug: string;
  date: Date;
  formattedDate: string;
  dayOfWeek: string;
}

export async function getLiturgia({
  limit,
  page,
  searchTerm,
  sort = "date_asc",
}: Params) {
  path.join(process.cwd(), "liturgia-content");

  const files = fs.readdirSync(path.join(process.cwd(), "liturgia-content"));
  const slugs = files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));

  let liturgias = await Promise.all(
    slugs.map(async ({ slug }) => {
      const metadata = await loadMdxMetadata(slug);
      return metadata;
    })
  );

  liturgias = liturgias.filter(
    (liturgia) => liturgia !== null
  ) as LiturgiaMetadata[];

  if (searchTerm && searchTerm.trim() !== "") {
    liturgias = liturgias.filter((liturgia) =>
      liturgia.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const totalLiturgias = liturgias.length;
  const [sortBy, sortOrder] = sort.split("_");

  liturgias.sort((a: LiturgiaMetadata, b: LiturgiaMetadata) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
        console.error("Invalid date found", {
          dateA: a.date,
          dateB: b.date,
        });
      }

      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });

  for (const liturgia of liturgias) {
    const date = new Date(liturgia.date);
    liturgia.formattedDate = date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dayOfWeekRaw = date.toLocaleDateString("pt-BR", {
      weekday: "long",
    });
    liturgia.dayOfWeek =
      dayOfWeekRaw.charAt(0).toUpperCase() + dayOfWeekRaw.slice(1);
  }

  const start = ((page ?? 1) - 1) * (limit ?? 10);

  if (limit) {
    liturgias = liturgias.slice(start, start + limit);
  }

  return { liturgias, totalLiturgias };
}

async function loadMdxMetadata(slug: string): Promise<LiturgiaMetadata | null> {
  try {
    const mdxPath = path.join(process.cwd(), "liturgia-content", `${slug}.mdx`);

    if (!fs.existsSync(mdxPath)) {
      return null;
    }
    const { metadata } = await import(`@/liturgia-content/${slug}.mdx`);
    return {
      ...metadata,
      slug,
    } as LiturgiaMetadata;
  } catch (error) {
    console.error("Failed to load MDX file:", error);
    return null;
  }
}
