import { cache } from "react";
import { getLiturgyEntry, readContentSource } from "./content-metadata";
import { getLiturgicalDate } from "./liturgical-date";
import { decodeRouteSegment } from "./route-segment";

export const currentLiturgyDate = cache(() => getLiturgicalDate());

export const loadLiturgy = cache(async (segment: string) => {
  const slug = decodeRouteSegment(segment);
  if (!slug) return null;
  const entry = getLiturgyEntry(slug);
  if (!entry) return null;
  const { default: Content } = await import(`@/liturgia-content/${slug}.mdx`);
  return { entry, Content, source: readContentSource("liturgia-content", slug) || "" };
});
