import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LiturgyTracker } from "@/components/analytics/liturgy-tracker";
import { TrackedTodayLink } from "@/components/analytics/tracked-today-link";
import JsonLd from "@/components/jsonld/JsonLd";
import { SocialShare } from "@/components/social-share/social-share";
import { NewsletterPanel } from "@/components/newsletter-panel";
import type { ContentIndexEntry } from "@/lib/content-metadata";
import { formatCivilDate, parseCivilDate } from "@/lib/liturgical-date";
import { calendarHref, calendarMonthLabel } from "@/lib/liturgy-calendar";
import { buildLiturgyDescription, extractLiturgyFacts } from "@/lib/liturgy-facts";
import { contentPublishedAt, contentModifiedAt } from "@/lib/content-dates";
import { SITE_URL } from "@/lib/seo";
import { AdjacentDays } from "./adjacent-days";

export function LiturgyPage({ entry, source, children, isToday, todayRoute = false }: {
  entry: ContentIndexEntry; source: string; children: ReactNode; isToday: boolean; todayRoute?: boolean;
}) {
  const date = parseCivilDate(entry.date);
  const monthUrl = calendarHref(date);
  const formatted = formatCivilDate(date);
  const title = `Liturgia de ${formatted}`;
  const description = buildLiturgyDescription(entry.title, formatted, extractLiturgyFacts(source));
  const celebration = entry.title.split("|").map(part => part.trim()).filter(part => part.toLocaleLowerCase("pt-BR") !== entry.dayOfWeek.toLocaleLowerCase("pt-BR")).join(" · ");
  const context = celebration.toLocaleLowerCase("pt-BR").includes(entry.dayOfWeek.toLocaleLowerCase("pt-BR")) ? celebration : `${entry.dayOfWeek} · ${celebration}`;
  const sections = [
    { id: "leituras", label: "Leituras", available: /^##\s+Leituras do Dia\s*$/m.test(source) },
    { id: "evangelho", label: "Evangelho", available: Boolean(extractLiturgyFacts(source).gospel) },
    { id: "reflexao", label: "Reflexão", available: /^##\s+Reflexão do Evangelho\s*$/m.test(source) },
    { id: "noticias", label: "Notícias", available: /^##\s+Notícias do Vaticano\s*$/m.test(source) },
  ].filter(section => section.available);
  const slug = todayRoute ? "hoje" : entry.slug;
  const url = `${SITE_URL}/liturgia/${slug}`;
  const imageUrl = `${url}/opengraph-image`;
  return <div className="reading-container">
    <LiturgyTracker slug={entry.slug} isToday={isToday} />
    <div className="liturgy-topline"><Link href={monthUrl}><ArrowLeft className="size-4" aria-hidden="true" />Calendário de {calendarMonthLabel(date.year, date.month)}</Link>{!isToday && <TrackedTodayLink>Liturgia de hoje</TrackedTodayLink>}</div>
    <header className="liturgy-header"><h1>{todayRoute ? "Liturgia de hoje," : "Liturgia de"}{" "}<span className="block">{formatted}</span></h1><p className="liturgy-context">{context}</p></header>
    {sections.length > 0 && <nav aria-label="Seções da liturgia" className="section-nav">{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</nav>}
    <AdjacentDays date={entry.date} />
    <article className="editorial-prose liturgy-prose" aria-label={title}>{children}</article>
    <AdjacentDays date={entry.date} afterReading />
    <section className="my-8 border-t border-amber-200/70 pt-6" aria-labelledby="share-title"><h2 id="share-title" className="mb-4 text-sm font-medium text-slate-600">Compartilhe esta liturgia</h2><SocialShare title={title} description={description} slug={slug} imagePath={`/liturgia/${slug}/opengraph-image`} /></section>
    <NewsletterPanel source={todayRoute ? "liturgia_hoje" : "liturgia_datada"} />
    <JsonLd data={[
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: [imageUrl],
        datePublished: contentPublishedAt(entry),
        dateModified: contentModifiedAt(entry),
        author: { "@type": "Organization", name: "LiturgiaNews", url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: "LiturgiaNews",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/android-chrome-192x192.png`,
            width: 192,
            height: 192,
          },
        },
        mainEntityOfPage: url,
        inLanguage: "pt-BR",
      },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Calendário", item: `${SITE_URL}/liturgia` },
        { "@type": "ListItem", position: 3, name: calendarMonthLabel(date.year, date.month), item: `${SITE_URL}${monthUrl}` },
        { "@type": "ListItem", position: 4, name: todayRoute ? "Liturgia de hoje" : title, item: url },
      ] },
    ]} />
  </div>;
}
