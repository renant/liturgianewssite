import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildLiturgyMdxComponents, LiturgyPage } from "@/components/liturgy/liturgy-page";
import { contentPublishedAt, contentModifiedAt } from "@/lib/content-dates";
import { getContentIndex, isOriginalLiturgyEntry } from "@/lib/content-metadata";
import { currentLiturgyDate, loadLiturgy } from "@/lib/liturgy-data";
import { buildLiturgyDescription, buildLiturgyPageTitle, buildSundayDescription, extractLiturgyFacts, isSunday, isUpcomingSunday, liturgyCelebrationName, liturgyDocumentTitle } from "@/lib/liturgy-facts";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const liturgy = await loadLiturgy(slug);
  if (!liturgy) notFound();
  const { entry, source } = liturgy;
  const facts = extractLiturgyFacts(source);
  const upcomingSunday = isUpcomingSunday(entry.date, currentLiturgyDate().iso);
  const extras = isSunday(entry.date)
    ? [liturgyCelebrationName(entry.title), facts.gospel]
    : [facts.gospel];
  const title = liturgyDocumentTitle(buildLiturgyPageTitle(entry.formattedDate, extras));
  const description = upcomingSunday ? buildSundayDescription(entry.title, entry.formattedDate, facts) : buildLiturgyDescription(entry.title, entry.formattedDate, facts);
  const url = `https://www.liturgianews.site/liturgia/${entry.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: isOriginalLiturgyEntry(entry) ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: "article", publishedTime: contentPublishedAt(entry), modifiedTime: contentModifiedAt(entry), locale: "pt_BR", siteName: "LiturgiaNews" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const liturgy = await loadLiturgy(slug);
  if (!liturgy) notFound();
  const { entry, source, Content } = liturgy;
  const hasReflection = /^##\s+Reflexão do Evangelho\s*$/m.test(source);
  return <LiturgyPage entry={entry} source={source} isToday={entry.slug === currentLiturgyDate().slug}><Content components={buildLiturgyMdxComponents(entry.slug, { todayRoute: false, hasReflection })} /></LiturgyPage>;
}

export function generateStaticParams() { return getContentIndex("liturgia-content").map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
