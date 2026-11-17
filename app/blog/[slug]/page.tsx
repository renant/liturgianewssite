import JsonLd from "@/components/jsonld/JsonLd";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { RelatedPosts } from "@/components/related-posts/related-posts";
import { SocialShare } from "@/components/social-share/social-share";
import { Button } from "@/components/ui/button";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { formatCivilDate } from "@/lib/liturgical-date";
import { ArrowLeftIcon, BookOpen, Calendar, Clock, UserCheck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { getRelatedPosts } from "@/app/blog/actions";

type Props = {
  params: Promise<{ slug: string }>;
};

function computeArticleStats(slug: string): { wordCount: number; readingMinutes: number } {
  try {
    const mdxPath = path.join(process.cwd(), "content", `${slug}.mdx`);
    const raw = fs.readFileSync(mdxPath, "utf8");
    const body = raw.replace(/^export const metadata = \{[\s\S]*?\};\s*/, "");
    const words = body
      .replace(/[#>*_`~\[\]()]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    return {
      wordCount: words,
      readingMinutes: Math.max(3, Math.round(words / 200)),
    };
  } catch {
    return { wordCount: 900, readingMinutes: 5 };
  }
}

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
  const { wordCount, readingMinutes } = computeArticleStats(slug);
  const authorName = metadata.author || "Equipe Editorial LiturgiaNews";
  const formattedPubDate = metadata.date ? formatCivilDate(metadata.date) : null;

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

        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-4 py-3 text-xs text-slate-700"
          aria-label="Informações editoriais do artigo"
        >
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
            <UserCheck className="size-4 text-amber-800" aria-hidden="true" />
            Por {authorName}
          </span>
          {formattedPubDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-amber-800" aria-hidden="true" />
              <time dateTime={metadata.date}>{formattedPubDate}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber-800" aria-hidden="true" />
            Leitura de {readingMinutes} min ({wordCount} palavras)
          </span>
          {Array.isArray(metadata.tags) && metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {metadata.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-amber-300/80 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <article className="editorial-prose">
          <Post />
        </article>

        <section
          className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-5 sm:p-6 space-y-3"
          aria-labelledby="editorial-box-heading"
        >
          <div className="flex items-center gap-2 text-amber-900">
            <BookOpen className="size-5" aria-hidden="true" />
            <h2 id="editorial-box-heading" className="font-serif text-lg font-semibold text-slate-900">
              Sobre a Equipe Editorial LiturgiaNews
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">
            Este artigo formativo foi elaborado e revisado pela <strong>Equipe Editorial LiturgiaNews</strong> em fidelidade ao <em>Catecismo da Igreja Católica (CIC)</em>, à <em>Instrução Geral do Missal Romano (IGMR)</em> e ao Lecionário Oficial da CNBB. Nosso compromisso é oferecer formação litúrgica e bíblica gratuita, clara e acessível para fiéis leigos, famílias e agentes de pastoral.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium">
            <Link href="/liturgia/hoje" className="text-link">
              Rezar com a Liturgia de Hoje
            </Link>
            <Link href="/lectio-divina" className="text-link">
              Guia de Lectio Divina
            </Link>
            <Link href="/sobre" className="text-link">
              Conheça nossa metodologia editorial
            </Link>
          </div>
        </section>

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
            <Link href="/#newsletter">
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
              "@type": "Organization",
              name: authorName,
              url: `${SITE_URL}/sobre`,
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
            wordCount,
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
