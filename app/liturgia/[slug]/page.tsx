import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { SocialShare } from "@/components/social-share/social-share";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

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

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params || !(await params).slug) {
    throw new Error("Slug is required");
  }
  const { slug } = await params;
  const mdxModule = await loadMdxFile(slug);
  if (!mdxModule) {
    return {
      title: "Liturgia não encontrada",
      description: "Liturgia não encontrada",
    };
  }
  const { metadata } = mdxModule;
  const date = new Date(metadata.date);
  const dayOfWeekRaw = date.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
  const dayOfWeek =
    dayOfWeekRaw.charAt(0).toUpperCase() + dayOfWeekRaw.slice(1);
  const url = `https://www.liturgianews.site/liturgia/${slug}`;
  return {
    title: metadata.title,
    description: metadata.description || metadata.title,
    keywords: [
      "Liturgia",
      "Liturgia Diária",
      "Liturgia Católica",
      dayOfWeek,
      `liturgia ${dayOfWeek}`,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description || metadata.title,
      url: url,
      type: "article",
      publishedTime: date.toISOString(),
      modifiedTime: metadata.lastModified
        ? new Date(metadata.lastModified).toISOString()
        : undefined,
      authors: ["LiturgiaNews"],
      images: [
        {
          url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
          width: 1200,
          height: 630,
          alt: "LiturgiaNews - Liturgia Católica Diária",
        },
      ],
      locale: "pt_BR",
      siteName: "LiturgiaNews",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description || metadata.title,
      images: [
        "https://www.liturgianews.site/images/android-chrome-192x192.png",
      ],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mdxModule = await loadMdxFile(slug);
  if (!mdxModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Liturgia não encontrada</h1>
          <Button asChild variant="outline">
            <Link href="/liturgia">
              <ArrowLeftIcon className="mr-2 h-4 w-4" aria-label="Voltar" />
              Voltar para a lista
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  const { metadata, default: LiturgiaContent } = mdxModule;
  const date = new Date(metadata.date);
  const dayOfWeekRaw = date.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
  const dayOfWeek =
    dayOfWeekRaw.charAt(0).toUpperCase() + dayOfWeekRaw.slice(1);
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-lg mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Liturgia", href: "/liturgia" },
            { label: metadata.title, href: `/liturgia/${slug}` },
          ]}
          className="mb-4"
        />

        <Button asChild variant="outline" className="mb-2">
          <Link href="/liturgia">
            <ArrowLeftIcon className="mr-2 h-4 w-4" aria-label="Voltar" />
            Voltar para a lista
          </Link>
        </Button>
        <article
          className="prose max-w-none"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <meta itemProp="datePublished" content={date.toISOString()} />
          <LiturgiaContent />
        </article>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Compartilhe este conteúdo
          </h2>
          <SocialShare
            title={metadata.title}
            description={metadata.description || metadata.title}
          />
        </div>

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
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: metadata.title,
            description: metadata.description || metadata.title,
            datePublished: new Date(metadata.date).toISOString(),
            dateModified: metadata.lastModified
              ? new Date(metadata.lastModified).toISOString()
              : new Date(metadata.date).toISOString(),
            author: {
              "@type": "Organization",
              name: "LiturgiaNews",
              url: "https://www.liturgianews.site",
            },
            publisher: {
              "@type": "Organization",
              name: "LiturgiaNews",
              url: "https://www.liturgianews.site",
              logo: {
                "@type": "ImageObject",
                url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
                width: 192,
                height: 192,
              },
            },
            image:
              "https://www.liturgianews.site/images/android-chrome-192x192.png",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.liturgianews.site/liturgia/${slug}`,
            },
            articleSection: "Liturgia",
            keywords: `Liturgia, Liturgia Diária, Liturgia Católica, ${dayOfWeek}, Liturgia ${dayOfWeek}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Liturgia",
                item: "https://www.liturgianews.site/liturgia",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: metadata.title,
                item: `https://www.liturgianews.site/liturgia/${slug}`,
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export function generateStaticParams() {
  path.join(process.cwd(), "liturgia-content");
  const files = fs.readdirSync(path.join(process.cwd(), "liturgia-content"));
  const slugs = files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
  return slugs;
}

export const dynamicParams = false;
