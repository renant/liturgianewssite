import type { HTMLAttributes, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdUnit } from "@/components/ads/ad-unit";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { LiturgyTracker } from "@/components/analytics/liturgy-tracker";
import { TrackedTodayLink } from "@/components/analytics/tracked-today-link";
import JsonLd from "@/components/jsonld/JsonLd";
import { SocialShare } from "@/components/social-share/social-share";
import { NewsletterInline } from "@/components/newsletter-inline";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { getAdSenseConfig } from "@/lib/adsense";
import type { ContentIndexEntry } from "@/lib/content-metadata";
import { formatCivilDate, parseCivilDate } from "@/lib/liturgical-date";
import { calendarHref, calendarMonthLabel } from "@/lib/liturgy-calendar";
import { buildLiturgyDescription, extractLiturgyFacts } from "@/lib/liturgy-facts";
import { contentPublishedAt, contentModifiedAt } from "@/lib/content-dates";
import { SITE_URL } from "@/lib/seo";
import { AdjacentDays } from "./adjacent-days";

export function buildLiturgyMdxComponents(
  slug: string,
  options?: { todayRoute?: boolean; hasReflection?: boolean },
): MDXComponents {
  const { midSlot } = getAdSenseConfig();
  const todayRoute = options?.todayRoute ?? false;
  const hasReflection = options?.hasReflection ?? true;
  const inlineSource = todayRoute
    ? "liturgia_hoje_evangelho"
    : "liturgia_datada_evangelho";

  return {
    h2: ({ id, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
      if (id === "reflexao") {
        return (
          <>
            <NewsletterInline key={`${slug}-newsletter-inline`} source={inlineSource} />
            <h2 id={id} {...props}>
              {children}
            </h2>
          </>
        );
      }
      if (id === "noticias") {
        return (
          <>
            {!hasReflection && (
              <NewsletterInline key={`${slug}-newsletter-inline`} source={inlineSource} />
            )}
            <AdUnit key={`${slug}-mid`} slot={midSlot} position="after-reflection" />
            <h2 id={id} {...props}>
              {children}
            </h2>
          </>
        );
      }
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
  };
}

export function LiturgyPage({
  entry,
  source,
  children,
  isToday,
  todayRoute = false,
}: {
  entry: ContentIndexEntry;
  source: string;
  children: ReactNode;
  isToday: boolean;
  todayRoute?: boolean;
}) {
  const date = parseCivilDate(entry.date);
  const monthUrl = calendarHref(date);
  const formatted = formatCivilDate(date);
  const title = `Liturgia de ${formatted}`;
  const facts = extractLiturgyFacts(source);
  const description = buildLiturgyDescription(
    entry.title,
    formatted,
    facts,
  );
  const hasNews = /^##\s+Notícias do Vaticano\s*$/m.test(source);
  const celebration = entry.title
    .split("|")
    .map((part) => part.trim())
    .filter(
      (part) =>
        part.toLocaleLowerCase("pt-BR") !==
        entry.dayOfWeek.toLocaleLowerCase("pt-BR"),
    )
    .join(" · ");
  const context = celebration
    .toLocaleLowerCase("pt-BR")
    .includes(entry.dayOfWeek.toLocaleLowerCase("pt-BR"))
    ? celebration
    : `${entry.dayOfWeek} · ${celebration}`;
  const sections = [
    {
      id: "leituras",
      label: "Leituras",
      available: /^##\s+Leituras do Dia\s*$/m.test(source),
    },
    {
      id: "evangelho",
      label: "Evangelho",
      available: Boolean(facts.gospel),
    },
    {
      id: "reflexao",
      label: "Reflexão",
      available: /^##\s+Reflexão do Evangelho\s*$/m.test(source),
    },
    {
      id: "noticias",
      label: "Notícias",
      available: hasNews,
    },
  ].filter((section) => section.available);
  const slug = todayRoute ? "hoje" : entry.slug;
  const url = `${SITE_URL}/liturgia/${slug}`;
  const imageUrl = `${url}/opengraph-image`;
  const { midSlot, bottomSlot } = getAdSenseConfig();
  return (
    <div className="reading-container">
      <AdSenseScript />
      <LiturgyTracker slug={entry.slug} isToday={isToday} />
      <div className="liturgy-topline">
        <Link href={monthUrl}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Calendário de {calendarMonthLabel(date.year, date.month)}
        </Link>
        {!isToday && <TrackedTodayLink>Liturgia de hoje</TrackedTodayLink>}
      </div>
      <header className="liturgy-header">
        <h1>
          {todayRoute ? "Liturgia de hoje," : "Liturgia de"}{" "}
          <span className="block">{formatted}</span>
        </h1>
        <p className="liturgy-context">{context}</p>
      </header>
      {sections.length > 0 && (
        <nav aria-label="Seções da liturgia" className="section-nav">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-ph-capture-attribute-nav="section_nav"
              data-ph-capture-attribute-section={section.id}
            >
              {section.label}
            </a>
          ))}
        </nav>
      )}
      <AdjacentDays date={entry.date} />
      <article className="editorial-prose liturgy-prose" aria-label={title}>
        {children}
      </article>
      {!hasNews && (
        <AdUnit
          key={`${entry.slug}-mid-fallback`}
          slot={midSlot}
          position="after-reflection"
        />
      )}
      <section
        className="my-8 rounded-lg border border-amber-200/80 bg-amber-50/40 p-5 sm:p-6"
        aria-labelledby="prayer-guide-title"
      >
        <h2
          id="prayer-guide-title"
          className="font-serif text-xl font-semibold text-slate-900"
        >
          Como rezar e meditar esta liturgia
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Para acolher com profundidade a Palavra proclamada nesta celebração (
          <strong className="font-medium text-slate-900">{context}</strong>
          {facts.firstReading ? `, primeira leitura ${facts.firstReading}` : ""}
          {facts.gospel ? ` e Evangelho ${facts.gospel}` : ""}), reserve alguns
          minutos de silêncio seguindo os passos da{" "}
          <Link href="/lectio-divina" className="text-link">
            Lectio Divina
          </Link>
          :
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
          <li>
            <strong className="font-medium text-slate-900">
              Leitura (Lectio):
            </strong>{" "}
            Releia com calma o Evangelho{" "}
            {facts.gospel ? `(${facts.gospel})` : "do dia"} e observe as
            palavras, gestos e atitudes de Jesus diante dos seus interlocutores.
          </li>
          <li>
            <strong className="font-medium text-slate-900">
              Meditação (Meditatio):
            </strong>{" "}
            Identifique uma frase ou convite que toca sua realidade hoje e
            conecte-o com a reflexão do Evangelho acima.
          </li>
          <li>
            <strong className="font-medium text-slate-900">
              Oração e Ação (Oratio &amp; Actio):
            </strong>{" "}
            Converse com Deus com confiança filial, agradecendo pela luz da
            Palavra, e escolha um gesto concreto de caridade, paciência ou
            fidelidade para viver ao longo deste dia.
          </li>
        </ol>
      </section>
      <AdjacentDays date={entry.date} afterReading />
      <section
        className="my-8 border-t border-amber-200/70 pt-6"
        aria-labelledby="share-title"
      >
        <h2 id="share-title" className="mb-4 text-sm font-medium text-slate-600">
          Compartilhe esta liturgia
        </h2>
        <SocialShare
          title={title}
          description={description}
          slug={slug}
          imagePath={`/liturgia/${slug}/opengraph-image`}
        />
      </section>
      <AdUnit
        key={`${entry.slug}-bottom`}
        slot={bottomSlot}
        position="after-reading"
      />
      <NewsletterPanel source={todayRoute ? "liturgia_hoje" : "liturgia_datada"} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            image: [imageUrl],
            datePublished: contentPublishedAt(entry),
            dateModified: contentModifiedAt(entry),
            author: {
              "@type": "Organization",
              name: "LiturgiaNews",
              url: SITE_URL,
            },
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
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: "Calendário",
                item: `${SITE_URL}/liturgia`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: calendarMonthLabel(date.year, date.month),
                item: `${SITE_URL}${monthUrl}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: todayRoute ? "Liturgia de hoje" : title,
                item: url,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
