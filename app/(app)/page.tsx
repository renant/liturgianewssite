import JsonLd from "@/components/jsonld/JsonLd";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { getContentIndex, getLiturgyEntry, readContentSource } from "@/lib/content-metadata";
import { getLiturgicalDate } from "@/lib/liturgical-date";
import { extractLiturgyFacts } from "@/lib/liturgy-facts";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Liturgia Católica Diária e Newsletter Gratuita",
  description: "Leia a liturgia de hoje, consulte as leituras de outras datas no calendário e receba gratuitamente a liturgia católica diária por e-mail.",
  path: "/",
});

function extractReflectionExcerpt(source: string): string | null {
  const match = /##\s+Reflexão do Evangelho\s*\n+([^\n#]+)/m.exec(source);
  if (!match) return null;
  const text = match[1].replace(/[*_~`>]/g, "").trim();
  return text.length > 320 ? `${text.slice(0, 317).trimEnd()}...` : text;
}

export default function Home() {
  const today = getLiturgicalDate();
  const todayEntry = getLiturgyEntry(today.slug);
  const todaySource = todayEntry ? readContentSource("liturgia-content", today.slug) || "" : "";
  const todayFacts = todaySource ? extractLiturgyFacts(todaySource) : {};
  const todayReflection = todaySource ? extractReflectionExcerpt(todaySource) : null;

  const recentPosts = [...getContentIndex("content")]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <div className="grid items-center gap-10 py-4 md:grid-cols-[1.15fr_1fr] md:gap-14 md:py-10">
        <section aria-labelledby="home-title">
          <p className="eyebrow">Liturgia católica diária</p>
          <h1
            id="home-title"
            className="max-w-xl font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl"
          >
            Um encontro com a Palavra, em cada dia.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Leituras, salmos, Evangelho e reflexões para acompanhar seu momento de oração pessoal, familiar e comunitária.
          </p>
          <nav
            className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5"
            aria-label="Acompanhe a liturgia"
          >
            <Link
              href="/liturgia/hoje"
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-amber-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-800"
            >
              <BookOpen className="size-4" aria-hidden="true" />
              Ler a liturgia de hoje
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/liturgia"
              className="text-link inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              Calendário litúrgico
            </Link>
          </nav>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-600">
            Reserve alguns minutos para ler, meditar e levar a Palavra de Deus para o seu dia.
          </p>
        </section>
        <NewsletterPanel source="home" />
      </div>

      {todayEntry && (
        <section
          className="mt-10 rounded-xl border border-amber-200/80 bg-amber-50/40 p-6 sm:p-8 md:mt-14"
          aria-labelledby="today-highlight-title"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="eyebrow">Resumo de hoje · {today.formatted}</p>
              <h2
                id="today-highlight-title"
                className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl"
              >
                {todayEntry.title}
              </h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-sm text-slate-700">
                {todayFacts.firstReading && (
                  <span>
                    <strong className="font-medium text-slate-900">Primeira Leitura:</strong>{" "}
                    {todayFacts.firstReading}
                  </span>
                )}
                {todayFacts.gospel && (
                  <span>
                    <strong className="font-medium text-slate-900">Evangelho:</strong>{" "}
                    {todayFacts.gospel}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/liturgia/hoje"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-amber-800 underline underline-offset-4 hover:text-amber-950"
            >
              Ler leituras completas
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {todayReflection && (
            <div className="mt-4 border-t border-amber-200/60 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                Meditação do Evangelho de Hoje
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {todayReflection}
              </p>
            </div>
          )}
        </section>
      )}

      <section
        className="mt-10 border-t border-amber-200/70 pt-8 md:mt-14"
        aria-labelledby="start-title"
      >
        <h2
          id="start-title"
          className="font-serif text-2xl font-semibold text-slate-900"
        >
          Para acompanhar com calma
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Guias práticos de espiritualidade e formação para ajudar você a compreender o ritmo das leituras bíblicas e aprofundar sua vida de oração.
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <Link className="group space-y-2" href="/acompanhar">
            <h3 className="font-serif text-xl font-semibold text-amber-800 group-hover:underline">
              Como acompanhar a liturgia diária
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Um caminho simples para ler a Primeira Leitura, o Salmo e o Evangelho com atenção, silêncio e constância.
            </p>
          </Link>
          <Link className="group space-y-2" href="/lectio-divina">
            <h3 className="font-serif text-xl font-semibold text-amber-800 group-hover:underline">
              Lectio divina: leitura e oração
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Conheça os quatro degraus tradicionais da leitura orante: leitura, meditação, oração e contemplação da Palavra.
            </p>
          </Link>
          <Link className="group space-y-2" href="/tempo-liturgico">
            <h3 className="font-serif text-xl font-semibold text-amber-800 group-hover:underline">
              O que é o tempo litúrgico
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Entenda como o Advento, o Natal, a Quaresma, a Páscoa e o Tempo Comum organizam a celebração da fé ao longo do ano.
            </p>
          </Link>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section
          className="mt-10 border-t border-amber-200/70 pt-8 md:mt-14"
          aria-labelledby="blog-highlights-title"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2
                id="blog-highlights-title"
                className="font-serif text-2xl font-semibold text-slate-900"
              >
                Artigos de formação litúrgica
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Aprofunde seu conhecimento sobre a Santa Missa, os Salmos e os tempos da Igreja.
              </p>
            </div>
            <Link href="/blog" className="text-link text-sm">
              Ver todos os artigos do blog
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {recentPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-lg border border-amber-200/70 bg-white/70 p-5"
              >
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">{post.formattedDate}</p>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-slate-900">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-amber-800 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.description && (
                    <p className="text-sm leading-relaxed text-slate-600">
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-medium text-amber-800 underline underline-offset-4 hover:text-amber-950"
                  >
                    Ler artigo completo<span className="sr-only">: {post.title}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        className="mt-10 border-t border-amber-200/70 pt-8 md:mt-14"
        aria-labelledby="about-liturgy-title"
      >
        <h2
          id="about-liturgy-title"
          className="font-serif text-2xl font-semibold text-slate-900"
        >
          Por que meditar a Liturgia Católica Diária?
        </h2>
        <div className="mt-4 grid gap-6 text-sm leading-relaxed text-slate-700 md:grid-cols-2">
          <p>
            Na tradição católica, a Liturgia da Palavra propõe diariamente um itinerário bíblico contínuo que une comunidades, paróquias e famílias do mundo inteiro em torno das mesmas Escrituras. Ao acompanhar a Primeira Leitura, o Salmo Responsorial e o Evangelho do dia, o fiel percorre os principais livros do Antigo e do Novo Testamento guiado pela sabedoria materna da Igreja.
          </p>
          <p>
            A <strong>LiturgiaNews</strong> organiza esse conteúdo com clareza tipográfica, sem distrações, acrescentando reflexões pastorais originais e roteiros de oração baseados na <em>Lectio Divina</em>. Você pode consultar gratuitamente qualquer data no{" "}
            <Link href="/liturgia" className="text-link">
              calendário litúrgico
            </Link>{" "}
            ou receber a leitura todas as manhãs em sua caixa de entrada.
          </p>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Liturgia Católica Diária e Newsletter Gratuita",
          url: SITE_URL,
          description: "Leituras da liturgia católica diária e newsletter gratuita.",
          inLanguage: "pt-BR",
        }}
      />
    </>
  );
}
