import JsonLd from "@/components/jsonld/JsonLd";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type Props = {
  params: Promise<{ slug: string }>;
};

async function loadMdxFile(slug: string) {
  try {
    const mdxPath = path.join(process.cwd(), "content", `${slug}.mdx`);

    if (!fs.existsSync(mdxPath)) {
      return null;
    }
    const mdxModule = await import(`@/content/${slug}.mdx`);
    return mdxModule;
  } catch (error) {
    console.error("Failed to load MDX file:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params || !(await params).slug) {
    throw new Error("Slug is required");
  }

  const { slug } = await params;
  const mdxModule = await loadMdxFile(slug);

  if (!mdxModule) {
    return {
      title: "Post não encontrado",
      description: "Post não encontrado",
    };
  }

  const { metadata } = mdxModule;

  const url = `https://www.liturgianews.site/blog/${slug}`;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: url,
    },
    keywords: metadata.tags,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
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
      description: metadata.description,
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
  const { metadata, default: Post } = await loadMdxFile(slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-lg mx-auto space-y-8">
        <Button asChild variant="outline" className="mb-2">
          <Link href="/blog">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Voltar para o blog
          </Link>
        </Button>
        <article className="prose prose-pink max-w-none">
          <meta
            itemProp="datePublished"
            content={new Date(metadata.date).toISOString()}
          />
          <Post />
        </article>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gostou do conteúdo?</h2>
          <p className="mb-4">
            Assine a nossa newsletter para receber as últimas atualizações
            diretamente no seu e-mail.
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
            description: metadata.description,
            datePublished: new Date(metadata.date).toISOString(),
            author: {
              "@type": "Person",
              name: "Bora Churrasco",
            },
            image:
              "https://www.liturgianews.site/images/android-chrome-192x192.png",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.liturgianews.site/blog/${slug}`.toString(),
            },
            articleSection: metadata.tags?.[0],
            keywords: metadata.tags?.join(", "),
          }}
        />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  path.join(process.cwd(), "content");

  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  const slugs = files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));

  return slugs;
}

export const dynamicParams = false;
