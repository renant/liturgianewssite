import type { Metadata } from "next";
import Link from "next/link";
import { contentPublishedAt, contentModifiedAt } from "@/lib/content-dates";
import { buildLiturgyMdxComponents, LiturgyPage } from "@/components/liturgy/liturgy-page";
import { currentLiturgyDate, loadLiturgy } from "@/lib/liturgy-data";
import { buildLiturgyDescription, extractLiturgyFacts } from "@/lib/liturgy-facts";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const today = currentLiturgyDate();
  const liturgy = await loadLiturgy(today.slug);
  const url = "https://www.liturgianews.site/liturgia/hoje";
  if (!liturgy) return { title: "Liturgia de hoje indisponível", description: "A liturgia de hoje ainda não está disponível. Consulte outras datas no calendário litúrgico.", alternates: { canonical: url } };
  const title = `Liturgia de hoje, ${today.formatted}`;
  const description = buildLiturgyDescription(liturgy.entry.title, today.formatted, extractLiturgyFacts(liturgy.source));
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "article", locale: "pt_BR", siteName: "LiturgiaNews", publishedTime: contentPublishedAt(liturgy.entry), modifiedTime: contentModifiedAt(liturgy.entry) }, twitter: { card: "summary_large_image", title, description } };
}

export default async function Page() {
  const liturgy = await loadLiturgy(currentLiturgyDate().slug);
  if (!liturgy) return <section className="status-page"><p className="eyebrow">Liturgia diária</p><h1 className="page-title">A liturgia de hoje ainda não está disponível.</h1><p className="page-description mt-4">Consulte as leituras de outras datas enquanto aguarda.</p><Link className="text-link mt-6 inline-flex min-h-11 items-center" href="/liturgia">Abrir o calendário litúrgico</Link></section>;
  const { entry, source, Content } = liturgy;
  return <LiturgyPage entry={entry} source={source} isToday todayRoute><Content components={buildLiturgyMdxComponents(entry.slug)} /></LiturgyPage>;
}
