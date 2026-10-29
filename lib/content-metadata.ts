import fs from "node:fs";
import path from "node:path";
import { formatCivilDate } from "./liturgical-date";

export type ContentMetadata = {
  title: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  description?: string;
  author?: string | null;
  tags?: string[];
};

export type ContentIndexEntry = ContentMetadata & {
  slug: string;
  formattedDate: string;
  dayOfWeek: string;
};

const HEADER_READ_BYTES = 2560;

function quotedField(source: string, field: string): string | undefined {
  return new RegExp(`${field}\\s*:\\s*(["'])([\\s\\S]*?)\\1`).exec(source)?.[2];
}

function readHeaderSlice(filePath: string): string {
  const fd = fs.openSync(filePath, "r");
  try {
    const buffer = Buffer.allocUnsafe(HEADER_READ_BYTES);
    const bytesRead = fs.readSync(fd, buffer, 0, HEADER_READ_BYTES, 0);
    return buffer.toString("utf8", 0, bytesRead);
  } finally {
    fs.closeSync(fd);
  }
}

export function parseExportedMetadata(source: string): ContentMetadata | null {
  const header = source.slice(0, HEADER_READ_BYTES);
  const title = quotedField(header, "title");
  const date = quotedField(header, "date");
  if (!title || !date) return null;
  const tagsSource = /tags\s*:\s*\[([^\]]*)\]/.exec(header)?.[1] || "";
  const tags = Array.from(tagsSource.matchAll(/(["'])(.*?)\1/g), (match) => match[2]);
  const authorMatch = /author\s*:\s*(null|(["'])(.*?)\2)/.exec(header);

  return {
    title,
    date,
    publishedAt: quotedField(header, "publishedAt"),
    updatedAt: quotedField(header, "updatedAt"),
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
const slugSetCache = new Map<string, Set<string>>();

export function getContentIndex(directory: "liturgia-content" | "content"): ContentIndexEntry[] {
  const cached = indexCache.get(directory);
  if (cached) return cached;

  const directoryPath = path.join(process.cwd(), directory);
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" });
  const index = fs.readdirSync(directoryPath)
    .filter((file) => file.endsWith(".mdx"))
    .flatMap((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const header = readHeaderSlice(path.join(directoryPath, file));
      const metadata = parseExportedMetadata(header);
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
  slugSetCache.set(directory, new Set(index.map((entry) => entry.slug)));
  return index;
}

export function getContentSlugSet(directory: "liturgia-content" | "content"): ReadonlySet<string> {
  const cached = slugSetCache.get(directory);
  if (cached) return cached;
  getContentIndex(directory);
  return slugSetCache.get(directory)!;
}

export function getLiturgyEntry(slug: string) {
  return getContentIndex("liturgia-content").find((entry) => entry.slug === slug) || null;
}
