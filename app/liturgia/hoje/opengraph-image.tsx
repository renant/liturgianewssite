import { getLiturgyEntry, readContentSource } from "@/lib/content-metadata";
import { getLiturgicalDate } from "@/lib/liturgical-date";
import { createLiturgyImage, liturgyImageSize } from "@/lib/liturgy-image";
import { extractLiturgyFacts } from "@/lib/liturgy-facts";

export const size = liturgyImageSize;
export const contentType = "image/png";
export const revalidate = 300;

export default function Image() {
  const today = getLiturgicalDate();
  const entry = getLiturgyEntry(today.slug);
  if (!entry) throw new Error("Liturgia de hoje não encontrada");
  const facts = extractLiturgyFacts(readContentSource("liturgia-content", today.slug) || "");
  return createLiturgyImage(today.formatted, entry.title, facts);
}
