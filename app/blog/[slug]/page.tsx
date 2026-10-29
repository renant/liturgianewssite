import JsonLd from "@/components/jsonld/JsonLd";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { RelatedPosts } from "@/components/related-posts/related-posts";
import { SocialShare } from "@/components/social-share/social-share";
import { Button } from "@/components/ui/button";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { getRelatedPosts } from "@/app/blog/actions";

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
    notFound();
  }

  const { slug } = await params;
  const mdxModule = await loadMdxFile(slug);

  if (!mdxModule) {
    notFound();
  }

  const { metadata } = mdxModule;
  const url = `${SITE_URL}/blog/${slug}`;
  const ogImage = metadata.image
    ? {
        url: metadata.image,
        width: metadata.imageWidth || 1200,
        height: metadata.imageHeight || 630,
        alt: metadata.imageAlt || metadata.title,
      }
    : DEFAULT_OG_IMAGE;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: url,
    },
    keywords: metadata.tags,
    authors: [{ name: metadata.author || "LiturgiaNews" }],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url,
      type: "article",
      publishedTime: new Date(metadata.date).toISOString(),
      modifiedTime: metadata.lastModified ? new Date(metadata.lastModified).toISOString() : undefined,
      authors: [metadata.author || "LiturgiaNews"],
      tags: metadata.tags,
      images: [ogImage],
      locale: "pt_BR",
      siteName: "LiturgiaNews",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [ogImage.url],
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

  if (!mdxModule) notFound();

  const { metadata, default: Post } = mdxModule;

  // Get related posts
  const relatedPosts = await getRelatedPosts(
    slug,
    metadata.tags || [],
    3
  );

  return (
    <div className="reading-container">
      <div className="space-y-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: metadata.title, href: `/blog/${slug}` },
          ]}
          className="mb-4"
        />

        <nav aria-label="Navegação">
          <Button asChild variant="outline" className="mb-2">
            <Link href="/blog">
              <ArrowLeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Voltar para o blog
            </Link>
          </Button>
        </nav>

        <article className="editorial-prose">
          <Post />
        </article>

        <div className="border-t border-amber-200/70 pt-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Compartilhe este conteúdo
          </h2>
          <SocialShare
            title={metadata.title}
            description={metadata.description}
          />
        </div>

        <aside className="border-t border-amber-200/70 pt-6">
          <h2 className="text-2xl font-bold mb-4">Gostou do conteúdo?</h2>
          <p className="mb-4">
            Assine a nossa newsletter para receber as últimas atualizações
            diretamente no seu e-mail.
          </p>
          <Button asChild variant="default">
            <Link href="/#newsletter" aria-label="Assinar newsletter da LiturgiaNews">
              Assinar Newsletter
            </Link>
          </Button>
        </aside>

        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentSlug={slug} />
        )}

        <JsonLd
          data={[{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: metadata.title,
            description: metadata.description,
            datePublished: new Date(metadata.date).toISOString(),
            dateModified: metadata.lastModified ? new Date(metadata.lastModified).toISOString() : new Date(metadata.date).toISOString(),
            author: {
              "@type": metadata.authorType || (metadata.author ? "Person" : "Organization"),
              name: metadata.author || "LiturgiaNews",
              url: metadata.authorUrl || SITE_URL,
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
            image: metadata.image || DEFAULT_OG_IMAGE.url,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/blog/${slug}`,
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
              url: `${SITE_URL}/blog`,
            },
          }]}
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
