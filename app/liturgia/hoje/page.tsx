import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import NewsletterModal from "./newsletter-modal";

// Cache revalidation to ensure the page updates periodically (changes daily)
export const revalidate = 3600;

// Helper to format date for display (e.g., "24 de julho de 2025")
function getFormattedDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  return `${day} de ${month} de ${year}`;
}

// Helper to get today's slug in format dd-mmmm-yyyy (e.g., 24-julho-2025)
function getTodaySlug() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper to load MDX file for a given slug from liturgia-content
async function loadMdxFile(slug: string) {
  try {
    const mdxPath = path.join(process.cwd(), "liturgia-content", `${slug}.mdx`);
    if (!fs.existsSync(mdxPath)) {
      return null;
    }
    const mdxModule = await import(`@/liturgia-content/${slug}.mdx`);
    return mdxModule;
  } catch (error) {
    console.error("Failed to load MDX file:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = getTodaySlug();
  const mdxModule = await loadMdxFile(slug);
  const url = `https://www.liturgianews.site/liturgia/hoje`;

  if (!mdxModule) {
    return {
      title: "Liturgia do Dia - Liturgia Diária Católica de Hoje",
      description:
        "Liturgia do dia de hoje. Leia a liturgia diária católica completa com leituras, salmos, evangelho e reflexões para fortalecer sua fé.",
      keywords: [
        "liturgia do dia",
        "liturgia diaria",
        "liturgia diária",
        "liturgia de hoje",
        "liturgia católica diária",
        "evangelho do dia",
        "leituras do dia",
        "missa de hoje",
        "liturgia católica de hoje",
      ],
      alternates: { canonical: url },
      openGraph: {
        title: "Liturgia do Dia - Liturgia Diária Católica de Hoje",
        description:
          "Liturgia do dia de hoje. Leia a liturgia diária católica completa com leituras, salmos, evangelho e reflexões para fortalecer sua fé.",
        images: [
          {
            url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
            width: 1200,
            height: 630,
            alt: "LiturgiaNews - Liturgia do Dia - Liturgia Diária Católica",
          },
        ],
        locale: "pt_BR",
        type: "article",
        siteName: "LiturgiaNews",
      },
      twitter: {
        card: "summary_large_image",
        title: "Liturgia do Dia - Liturgia Diária Católica de Hoje",
        description:
          "Liturgia do dia de hoje. Leia a liturgia diária católica completa com leituras, salmos, evangelho e reflexões.",
        images: [
          "https://www.liturgianews.site/images/android-chrome-192x192.png",
        ],
      },
    };
  }

  const { metadata } = mdxModule as {
    metadata: { title: string; description?: string; date: string };
  };

  const formattedDate = getFormattedDate();
  const seoTitle = `Liturgia do Dia ${formattedDate} - Liturgia Diária Católica`;
  const seoDescription = `Liturgia do dia de hoje (${formattedDate}). Leia a liturgia diária católica completa: ${
    metadata.description || metadata.title
  }. Acesse diariamente para fortalecer sua fé.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      "liturgia do dia",
      "liturgia diaria",
      "liturgia diária",
      "liturgia de hoje",
      "liturgia católica diária",
      "evangelho do dia",
      "leituras do dia",
      "missa de hoje",
      "liturgia católica de hoje",
      `liturgia ${formattedDate}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
          width: 1200,
          height: 630,
          alt: `LiturgiaNews - Liturgia do Dia ${formattedDate}`,
        },
      ],
      locale: "pt_BR",
      type: "article",
      siteName: "LiturgiaNews",
      publishedTime: new Date(metadata.date).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [
        "https://www.liturgianews.site/images/android-chrome-192x192.png",
      ],
    },
  };
}

export default async function Page() {
  const slug = getTodaySlug();
  const mdxModule = await loadMdxFile(slug);

  if (!mdxModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Liturgia de hoje não encontrada
          </h1>
          <Button asChild variant="outline">
            <Link href="/liturgia">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Ver todas as liturgias
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { metadata, default: LiturgiaContent } = mdxModule as {
    metadata: { title: string; description?: string; date: string };
    default: React.ComponentType;
  };

  const formattedDate = getFormattedDate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-lg mx-auto space-y-8">
        {/** Modal abre no carregamento para incentivar inscrição */}
        <NewsletterModal />

        {/* Breadcrumbs para SEO */}
        <Breadcrumbs
          items={[
            { label: "Liturgia", href: "/liturgia" },
            { label: "Liturgia do Dia", href: "/liturgia/hoje" },
          ]}
        />

        {/* Título semântico principal para SEO */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Liturgia do Dia</h1>
          <p className="text-lg text-slate-600 font-medium">{formattedDate}</p>
          <p className="text-sm text-slate-500">
            Liturgia diária católica completa com leituras, salmos e evangelho
          </p>
        </header>

        <Button asChild variant="outline" className="mb-2">
          <Link href="/liturgia">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Ver todas as liturgias
          </Link>
        </Button>

        <article
          className="prose max-w-none"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <meta
            itemProp="datePublished"
            content={new Date(metadata.date).toISOString()}
          />
          <meta
            itemProp="headline"
            content={`Liturgia do Dia ${formattedDate}`}
          />
          <meta
            itemProp="description"
            content={metadata.description || metadata.title}
          />
          <LiturgiaContent />
        </article>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Receba no seu e-mail</h2>
          <p className="mb-4">
            Assine a nossa newsletter para receber a liturgia diária no seu
            e-mail.
          </p>
          <Button asChild variant="default">
            <Link href="/">Assinar Newsletter</Link>
          </Button>
        </section>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: `Liturgia do Dia ${formattedDate} - Liturgia Diária Católica`,
          description: `Liturgia do dia de hoje (${formattedDate}). Leia a liturgia diária católica completa: ${
            metadata.description || metadata.title
          }`,
          datePublished: new Date(metadata.date).toISOString(),
          dateModified: new Date(metadata.date).toISOString(),
          author: {
            "@type": "Person",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site",
          },
          publisher: {
            "@type": "Organization",
            name: "LiturgiaNews",
            logo: {
              "@type": "ImageObject",
              url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
            },
          },
          image:
            "https://www.liturgianews.site/images/android-chrome-192x192.png",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.liturgianews.site/liturgia/hoje`,
          },
          articleSection: "Liturgia",
          keywords:
            "liturgia do dia, liturgia diaria, liturgia diária, liturgia de hoje, liturgia católica diária, evangelho do dia, leituras do dia, missa de hoje",
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
        }}
      />

      {/* Schema adicional para WebPage */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.liturgianews.site/liturgia/hoje",
          url: "https://www.liturgianews.site/liturgia/hoje",
          name: "Liturgia do Dia - Liturgia Diária Católica",
          description: `Liturgia do dia de hoje (${formattedDate}). Acesse diariamente para ler a liturgia católica completa.`,
          inLanguage: "pt-BR",
          isPartOf: {
            "@type": "WebSite",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site",
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.liturgianews.site",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Liturgia",
                item: "https://www.liturgianews.site/liturgia",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Liturgia do Dia",
                item: "https://www.liturgianews.site/liturgia/hoje",
              },
            ],
          },
        }}
      />
    </div>
  );
}
