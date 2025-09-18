import JsonLd from "@/components/jsonld/JsonLd";
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
  const url = `https://www.liturgianews.site/liturgia/${slug}`;
  return {
    title: metadata.title,
    description: metadata.description || metadata.title,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description || metadata.title,
      images: [
        {
          url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
          width: 1200,
          height: 630,
          alt: "LiturgiaNews - Liturgia Católica Diária",
        },
      ],
      locale: "pt_BR",
      type: "article",
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
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Voltar para a lista
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  const { metadata, default: LiturgiaContent } = mdxModule;
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-lg mx-auto space-y-8">
        <Button asChild variant="outline" className="mb-2">
          <Link href="/liturgia">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Link>
        </Button>
        <article className="prose max-w-none">
          <meta
            itemProp="datePublished"
            content={new Date(metadata.date).toISOString()}
          />
          <LiturgiaContent />
        </article>
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: metadata.title,
          description: metadata.title,
          datePublished: new Date(metadata.date).toISOString(),
          author: {
            "@type": "Person",
            name: "LiturgiaNews",
          },
          image:
            "https://www.liturgianews.site/images/android-chrome-192x192.png",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.liturgianews.site/liturgia/${slug}`.toString(),
          },
          articleSection: "Liturgia",
          keywords: "Liturgia, Liturgia Diária, Liturgia Católica",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
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
              name: metadata.title,
              item: `https://www.liturgianews.site/liturgia/${slug}`,
            },
          ],
        }}
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
