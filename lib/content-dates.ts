import type { ContentMetadata } from "./content-metadata";
import { getLiturgicalDate } from "./liturgical-date";

function recordedDate(value: string | undefined, now: Date) {
  return value && Number.isFinite(Date.parse(value)) && Date.parse(value) <= now.getTime() ? value : undefined;
}

export function contentPublishedAt(entry: ContentMetadata, now = new Date()) {
  return recordedDate(entry.publishedAt, now) ?? (entry.date <= getLiturgicalDate(now).iso ? entry.date : undefined);
}

export function contentModifiedAt(entry: ContentMetadata, now = new Date()) {
  return recordedDate(entry.updatedAt, now) ?? contentPublishedAt(entry, now);
}
