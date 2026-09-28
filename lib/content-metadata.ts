import fs from "node:fs";
import path from "node:path";
import { formatCivilDate } from "./liturgical-date";

export type ContentMetadata = {
  title: string;
  date: string;
  description?: string;
  author?: string | null;
  tags?: string[];
};

export type ContentIndexEntry = ContentMetadata & {
  slug: string;
  formattedDate: string;
  dayOfWeek: string;
};

function quotedField(source: string, field: string): string | undefined {
  return new RegExp(`${field}\\s*:\\s*(["'])([\\s\\S]*?)\\1`).exec(source)?.[2];
}

export function parseExportedMetadata(source: string): ContentMetadata | null {
  const header = source.slice(0, 2500);
  const title = quotedField(header, "title");
  const date = quotedField(header, "date");
  if (!title || !date) return null;
  const tagsSource = /tags\s*:\s*\[([^\]]*)\]/.exec(header)?.[1] || "";
  const tags = Array.from(tagsSource.matchAll(/(["'])(.*?)\1/g), (match) => match[2]);
  const authorMatch = /author\s*:\s*(null|(["'])(.*?)\2)/.exec(header);

  return {
    title,
    date,
    description: quotedField(header, "description"),
    author: authorMatch?.[1] === "null" ? null : authorMatch?.[3],
    tags,
  };
}

export function readContentSource(directory: "liturgia-content" | "content", slug: string): string | null {
  const filePath = path.join(process.cwd(), directory, `${slug}.mdx`);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

const indexCache = new Map<string, ContentIndexEntry[]>();

export function getContentIndex(directory: "liturgia-content" | "content"): ContentIndexEntry[] {
  const cached = indexCache.get(directory);
  if (cached) return cached;

  const directoryPath = path.join(process.cwd(), directory);
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" });
  const index = fs.readdirSync(directoryPath)
    .filter((file) => file.endsWith(".mdx"))
    .flatMap((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = fs.readFileSync(path.join(directoryPath, file), "utf8");
      const metadata = parseExportedMetadata(source);
      if (!metadata) return [];
      const weekday = formatter.format(new Date(`${metadata.date}T12:00:00Z`));
      return [{
        ...metadata,
        slug,
        formattedDate: formatCivilDate(metadata.date),
        dayOfWeek: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      }];
    });

  indexCache.set(directory, index);
  return index;
}

export function getLiturgyEntry(slug: string) {
  return getContentIndex("liturgia-content").find((entry) => entry.slug === slug) || null;
}
