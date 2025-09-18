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
    title: `${metadata.title} | Blog LiturgiaNews`,
    description: metadata.description,
    alternates: {
      canonical: url,
    },
    keywords: metadata.tags,
    authors: [{ name: metadata.author || "LiturgiaNews" }],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: url,
      type: "article",
      publishedTime: new Date(metadata.date).toISOString(),
      modifiedTime: metadata.lastModified ? new Date(metadata.lastModified).toISOString() : undefined,
      authors: [metadata.author || "LiturgiaNews"],
      tags: metadata.tags,
      images: [
        {
          url: metadata.image || "https://www.liturgianews.site/images/android-chrome-192x192.png",
          width: metadata.imageWidth || 1200,
          height: metadata.imageHeight || 630,
          alt: metadata.imageAlt || metadata.title,
        },
      ],
      locale: "pt_BR",
      siteName: "LiturgiaNews",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [metadata.image || "https://www.liturgianews.site/images/android-chrome-192x192.png"],
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
        <div className="max-w-lg mx-auto space-y-8">
          <h1 className="text-2xl font-bold">Post não encontrado</h1>
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Voltar para o blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { metadata, default: Post } = mdxModule;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-lg mx-auto space-y-8">
        <nav aria-label="Navegação">
          <Button asChild variant="outline" className="mb-2">
            <Link href="/blog">
              <ArrowLeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Voltar para o blog
            </Link>
          </Button>
        </nav>
        
        <article 
          className="prose prose-pink max-w-none"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <meta
            itemProp="datePublished"
            content={new Date(metadata.date).toISOString()}
          />
          <meta
            itemProp="dateModified"
            content={metadata.lastModified ? new Date(metadata.lastModified).toISOString() : new Date(metadata.date).toISOString()}
          />
          <meta itemProp="author" content={metadata.author || "LiturgiaNews"} />
          <meta itemProp="publisher" content="LiturgiaNews" />
          <meta itemProp="inLanguage" content="pt-BR" />
          <meta itemProp="url" content={`https://www.liturgianews.site/blog/${slug}`} />
          
          <Post />
        </article>
        
        <aside className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gostou do conteúdo?</h2>
          <p className="mb-4">
            Assine a nossa newsletter para receber as últimas atualizações
            diretamente no seu e-mail.
          </p>
          <Button asChild variant="default">
            <Link href="/" aria-label="Assinar newsletter da LiturgiaNews">
              Assinar Newsletter
            </Link>
          </Button>
        </aside>
        
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: metadata.title,
            description: metadata.description,
            datePublished: new Date(metadata.date).toISOString(),
            dateModified: metadata.lastModified ? new Date(metadata.lastModified).toISOString() : new Date(metadata.date).toISOString(),
            author: {
              "@type": metadata.authorType || "Person",
              name: metadata.author || "LiturgiaNews",
              url: metadata.authorUrl || "https://www.liturgianews.site"
            },
            publisher: {
              "@type": "Organization",
              name: "LiturgiaNews",
              url: "https://www.liturgianews.site",
              logo: {
                "@type": "ImageObject",
                url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
                width: 192,
                height: 192
              }
            },
            image: metadata.image || "https://www.liturgianews.site/images/android-chrome-192x192.png",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.liturgianews.site/blog/${slug}`,
            },
            articleBody: metadata.excerpt || metadata.description,
            articleSection: metadata.category || metadata.tags?.[0] || "Liturgia",
            keywords: metadata.tags?.join(", "),
            wordCount: metadata.wordCount,
            inLanguage: "pt-BR",
            isAccessibleForFree: true,
            isPartOf: {
              "@type": "Blog",
              name: "Blog da Liturgia Católica Diária",
              url: "https://www.liturgianews.site/blog"
            }
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
                name: "Blog",
                item: "https://www.liturgianews.site/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: metadata.title,
                item: `https://www.liturgianews.site/blog/${slug}`,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs.readdirSync(contentDir);
  const slugs = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));

  return slugs;
}

export const dynamicParams = false;
