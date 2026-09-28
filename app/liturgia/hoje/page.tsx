import NewsletterFormSignup from "@/app/(app)/newsletter-sigup-form";
import { LiturgyTracker } from "@/components/analytics/liturgy-tracker";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { AdjacentDays } from "@/components/liturgy/adjacent-days";
import { liturgyMdxComponents } from "@/components/liturgy/mdx-heading";
import { LiturgySummary } from "@/components/liturgy/liturgy-summary";
import { SocialShare } from "@/components/social-share/social-share";
import { Button } from "@/components/ui/button";
import { readContentSource } from "@/lib/content-metadata";
import { getLiturgicalDate } from "@/lib/liturgical-date";
import { buildLiturgyDescription, extractLiturgyFacts } from "@/lib/liturgy-facts";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

export const revalidate = 300;

async function loadMdxFile(slug: string) {
  const filePath = path.join(process.cwd(), "liturgia-content", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  try { return await import(`@/liturgia-content/${slug}.mdx`); }
  catch (error) { console.error("Failed to load MDX file:", error); return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getLiturgicalDate();
  const mdxModule = await loadMdxFile(today.slug);
  const canonical = "https://www.liturgianews.site/liturgia/hoje";
  if (!mdxModule) return { title: "Liturgia de hoje não encontrada", alternates: { canonical } };
  const source = readContentSource("liturgia-content", today.slug) || "";
  const facts = extractLiturgyFacts(source);
  const description = buildLiturgyDescription(mdxModule.metadata.title, today.formatted, facts);
  const title = `Liturgia de hoje, ${today.formatted}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article", locale: "pt_BR", siteName: "LiturgiaNews", publishedTime: `${mdxModule.metadata.date}T00:00:00-03:00` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page() {
  const today = getLiturgicalDate();
  const mdxModule = await loadMdxFile(today.slug);
  if (!mdxModule) return (
    <div className="min-h-screen flex items-center justify-center"><div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Liturgia de hoje não encontrada</h1>
      <Button asChild variant="outline"><Link href="/liturgia"><ArrowLeftIcon className="mr-2 h-4 w-4" aria-label="Voltar" />Ver todas as liturgias</Link></Button>
    </div></div>
  );

  const { metadata, default: LiturgiaContent } = mdxModule;
  const facts = extractLiturgyFacts(readContentSource("liturgia-content", today.slug) || "");
  const headline = `Liturgia de ${today.formatted}`;
  const description = buildLiturgyDescription(metadata.title, today.formatted, facts);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <LiturgyTracker slug={today.slug} isToday />
      <div className="max-w-lg mx-auto space-y-8">
        <Breadcrumbs items={[{ label: "Liturgia", href: "/liturgia" }, { label: "Liturgia de hoje", href: "/liturgia/hoje" }]} />
        <header className="space-y-3">
          <h1 className="text-3xl font-serif font-bold text-slate-900">{headline}</h1>
          <h2 className="text-xl font-serif font-semibold text-amber-800">{metadata.title}</h2>
          <Link href={`/liturgia/${today.slug}`} className="inline-flex text-sm text-amber-700 underline underline-offset-4">Endereço permanente deste dia</Link>
        </header>
        <LiturgySummary formattedDate={today.formatted} facts={facts} isToday />
        <AdjacentDays date={metadata.date} />
        <article className="prose max-w-none"><LiturgiaContent components={liturgyMdxComponents} /></article>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Quer receber a liturgia de amanhã no seu e-mail?</h2>
          <NewsletterFormSignup source="liturgia_hoje" />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Compartilhe esta liturgia</h2>
          <SocialShare title={headline} description={description} slug="hoje" imagePath="/liturgia/hoje/opengraph-image" />
        </section>
      </div>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline, description, datePublished: metadata.date, author: { "@type": "Organization", name: "LiturgiaNews" }, publisher: { "@type": "Organization", name: "LiturgiaNews" }, mainEntityOfPage: "https://www.liturgianews.site/liturgia/hoje", inLanguage: "pt-BR" },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.liturgianews.site" },
          { "@type": "ListItem", position: 2, name: "Liturgia", item: "https://www.liturgianews.site/liturgia" },
          { "@type": "ListItem", position: 3, name: "Liturgia de hoje", item: "https://www.liturgianews.site/liturgia/hoje" },
        ] },
      ]} />
    </div>
  );
}
