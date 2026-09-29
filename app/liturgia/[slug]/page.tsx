import NewsletterFormSignup from "@/app/(app)/newsletter-sigup-form";
import { LiturgyTracker } from "@/components/analytics/liturgy-tracker";
import { TrackedTodayLink } from "@/components/analytics/tracked-today-link";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { AdjacentDays } from "@/components/liturgy/adjacent-days";
import { liturgyMdxComponents } from "@/components/liturgy/mdx-heading";
import { LiturgySummary } from "@/components/liturgy/liturgy-summary";
import { SocialShare } from "@/components/social-share/social-share";
import { Button } from "@/components/ui/button";
import { getContentIndex, readContentSource } from "@/lib/content-metadata";
import { formatCivilDate, getLiturgicalDate } from "@/lib/liturgical-date";
import { buildLiturgyDescription, extractLiturgyFacts } from "@/lib/liturgy-facts";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type Props = { params: Promise<{ slug: string }> };

async function loadMdxFile(slug: string) {
  if (!fs.existsSync(path.join(process.cwd(), "liturgia-content", `${slug}.mdx`))) return null;
  try { return await import(`@/liturgia-content/${slug}.mdx`); }
  catch (error) { console.error("Failed to load MDX file:", error); return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mdxModule = await loadMdxFile(slug);
  if (!mdxModule) return { title: "Liturgia não encontrada", description: "Liturgia não encontrada" };
  const formattedDate = formatCivilDate(mdxModule.metadata.date);
  const facts = extractLiturgyFacts(readContentSource("liturgia-content", slug) || "");
  const title = facts.gospel ? `Liturgia de ${formattedDate}: Evangelho ${facts.gospel}` : `Liturgia de ${formattedDate} | ${mdxModule.metadata.title}`;
  const description = buildLiturgyDescription(mdxModule.metadata.title, formattedDate, facts);
  const canonical = `https://www.liturgianews.site/liturgia/${slug}`;
  return {
    title: { absolute: title }, description, alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article", publishedTime: `${mdxModule.metadata.date}T00:00:00-03:00`, locale: "pt_BR", siteName: "LiturgiaNews" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const mdxModule = await loadMdxFile(slug);
  if (!mdxModule) return <div className="min-h-screen flex items-center justify-center"><h1>Liturgia não encontrada</h1></div>;
  const { metadata, default: LiturgiaContent } = mdxModule;
  const formattedDate = formatCivilDate(metadata.date);
  const facts = extractLiturgyFacts(readContentSource("liturgia-content", slug) || "");
  const headline = `Liturgia de ${formattedDate}`;
  const description = buildLiturgyDescription(metadata.title, formattedDate, facts);
  const isToday = slug === getLiturgicalDate().slug;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <LiturgyTracker slug={slug} isToday={isToday} />
      <div className="max-w-lg mx-auto space-y-8">
        <Breadcrumbs items={[{ label: "Liturgia", href: "/liturgia" }, { label: headline, href: `/liturgia/${slug}` }]} />
        <Button asChild variant="outline"><Link href="/liturgia"><ArrowLeftIcon className="mr-2 h-4 w-4" aria-label="Voltar" />Voltar para a lista</Link></Button>
        <header className="space-y-3">
          <h1 className="text-3xl font-serif font-bold text-slate-900">{headline}</h1>
          <h2 className="text-xl font-serif font-semibold text-amber-800">{metadata.title}</h2>
          <TrackedTodayLink className="inline-flex text-sm text-amber-700 underline underline-offset-4">
            {isToday ? "Esta é a liturgia de hoje" : "Liturgia de hoje"}
          </TrackedTodayLink>
        </header>
        <LiturgySummary formattedDate={formattedDate} facts={facts} isToday={isToday} />
        <AdjacentDays date={metadata.date} />
        <article className="prose max-w-none"><LiturgiaContent components={liturgyMdxComponents} /></article>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">{isToday ? "Quer receber a liturgia de amanhã no seu e-mail?" : "Receba a liturgia de cada manhã no seu e-mail."}</h2>
          <NewsletterFormSignup source="liturgia_datada" />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Compartilhe este conteúdo</h2>
          <SocialShare title={headline} description={description} slug={slug} imagePath={`/liturgia/${slug}/opengraph-image`} />
        </section>
      </div>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline, description, datePublished: metadata.date, author: { "@type": "Organization", name: "LiturgiaNews" }, publisher: { "@type": "Organization", name: "LiturgiaNews" }, mainEntityOfPage: `https://www.liturgianews.site/liturgia/${slug}`, inLanguage: "pt-BR" },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.liturgianews.site" },
          { "@type": "ListItem", position: 2, name: "Liturgia", item: "https://www.liturgianews.site/liturgia" },
          { "@type": "ListItem", position: 3, name: headline, item: `https://www.liturgianews.site/liturgia/${slug}` },
        ] },
      ]} />
    </div>
  );
}

export function generateStaticParams() {
  return getContentIndex("liturgia-content").map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;
