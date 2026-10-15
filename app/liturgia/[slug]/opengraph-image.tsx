import { getLiturgyEntry, readContentSource } from "@/lib/content-metadata";
import { createLiturgyImage, liturgyImageSize } from "@/lib/liturgy-image";
import { extractLiturgyFacts } from "@/lib/liturgy-facts";
import { decodeRouteSegment } from "@/lib/route-segment";
import { notFound } from "next/navigation";

export const size = liturgyImageSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const slug = decodeRouteSegment((await params).slug);
  const entry = slug ? getLiturgyEntry(slug) : null;
  if (!entry) notFound();
  const facts = extractLiturgyFacts(readContentSource("liturgia-content", entry.slug) || "");
  return createLiturgyImage(entry.formattedDate, entry.title, facts);
}
