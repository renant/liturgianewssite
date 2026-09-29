import { getLiturgyEntry, readContentSource } from "@/lib/content-metadata";
import { createLiturgyImage, liturgyImageSize } from "@/lib/liturgy-image";
import { extractLiturgyFacts } from "@/lib/liturgy-facts";

export const size = liturgyImageSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getLiturgyEntry(slug);
  if (!entry) throw new Error("Liturgia não encontrada");
  const facts = extractLiturgyFacts(readContentSource("liturgia-content", slug) || "");
  return createLiturgyImage(entry.formattedDate, entry.title, facts);
}
