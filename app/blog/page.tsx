import JsonLd from "@/components/jsonld/JsonLd";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { PostCard } from "@/components/post-card/post-card";
import { Metadata } from "next";
import Link from "next/link";
import { getPosts, type PostMetadata } from "./actions";

const blogDescription = "Reflexões, ensinamentos e inspiração católica. Artigos sobre liturgia, fé, orações e vida cristã para fortalecer sua jornada espiritual.";

function getFirstValue(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = await searchParams;
  const page = Math.max(1, Number(getFirstValue(query.page)) || 1);
  const hasFilters = Boolean(getFirstValue(query.search)) ||
    (Boolean(getFirstValue(query.sort)) && getFirstValue(query.sort) !== "date_desc") ||
    (Boolean(getFirstValue(query.limit)) && Number(getFirstValue(query.limit)) !== 6);
  const canonical = hasFilters || page === 1
    ? "https://www.liturgianews.site/blog"
    : `https://www.liturgianews.site/blog?page=${page}`;
  return {
    title: "Blog - Liturgia Católica Diária",
    description: blogDescription,
    alternates: { canonical },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: { title: "Blog - Liturgia Católica Diária | LiturgiaNews", description: blogDescription, type: "website", url: canonical },
  };
}

function paginationHref(page: number, limit: number, search: string, sort: string) {
  const query = new URLSearchParams({ page: String(page) });
  if (limit !== 6) query.set("limit", String(limit));
  if (search) query.set("search", search);
  if (sort !== "date_desc") query.set("sort", sort);
  return `/blog?${query}`;
}

export default async function BlogPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(getFirstValue(searchParams.page)) || 1;
  const postsPerPage = Number(getFirstValue(searchParams.limit)) || 6;
  const sort = getFirstValue(searchParams.sort) || "date_desc";
  const searchTerm = getFirstValue(searchParams.search);

  const { posts, totalPosts } = await getPosts({
    limit: postsPerPage,
    page: currentPage,
    searchTerm,
    sort,
  });

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;
  const disabledLinkStyle = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
        <div className="max-w-4xl mx-auto space-y-8 py-12">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} className="mb-4" />
          
          <header className="text-center space-y-4">
            <h1 className="text-3xl font-serif font-semibold text-slate-800">
              Blog da Liturgia Católica Diária
            </h1>
            <p className="text-slate-600 text-lg">
              Reflexões, ensinamentos e inspiração para sua jornada de fé
            </p>
          </header>

          {searchTerm && (
            <section className="text-center mb-8" aria-label="Resultados da busca">
              <p className="text-slate-600">
                Resultados da busca por:{" "}
                <span className="font-medium text-amber-700">{searchTerm}</span>
              </p>
              <Link
                href="/blog"
                className="text-amber-700 hover:text-amber-900 underline text-sm mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Limpar busca
              </Link>
            </section>
          )}

          <main>
            {posts.length > 0 ? (
              <section aria-label="Lista de artigos">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post: PostMetadata) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ) : (
              <section className="text-center py-12" aria-label="Nenhum resultado">
                <p className="text-slate-600 text-lg">Nenhum post encontrado.</p>
                {searchTerm && (
                  <Link
                    href="/blog"
                    className="text-amber-700 hover:text-amber-900 underline mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Ver todos os posts
                  </Link>
                )}
              </section>
            )}
          </main>

          <nav aria-label="Paginação" className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {!isPreviousDisabled && (
                <Link
                  href={paginationHref(currentPage - 1, postsPerPage, searchTerm, sort)}
                  className={`${
                    isPreviousDisabled ? disabledLinkStyle : ""
                  } inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-amber-200 rounded-md shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                  aria-disabled={isPreviousDisabled}
                  tabIndex={isPreviousDisabled ? -1 : undefined}
                >
                  Anterior
                </Link>
              )}
              <span 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-amber-50 border border-amber-200 rounded-md"
                aria-current="page"
                aria-label={`Página ${currentPage} de ${totalPages}`}
              >
                {currentPage} de {totalPages}
              </span>
              {!isNextDisabled && (
                <Link
                  href={paginationHref(currentPage + 1, postsPerPage, searchTerm, sort)}
                  className={`${
                    isNextDisabled ? disabledLinkStyle : ""
                  } inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-amber-200 rounded-md shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                  aria-disabled={isNextDisabled}
                  tabIndex={isNextDisabled ? -1 : undefined}
                >
                  Próximo
                </Link>
              )}
            </div>
          </nav>
          
          <p className="text-center text-sm text-slate-500" aria-label={`Mostrando ${posts.length} de ${totalPosts} posts`}>
            Mostrando {posts.length} de {totalPosts} posts
          </p>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog da Liturgia Católica Diária",
          description: "Reflexões, ensinamentos e inspiração católica para sua jornada de fé",
          url: "https://www.liturgianews.site/blog",
          inLanguage: "pt-BR",
          publisher: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site"
          },
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            url: `https://www.liturgianews.site/blog/${post.slug}`,
            author: {
              "@type": "Organization",
              name: "LiturgiaNews"
            }
          }))
        }}
      />
    </>
  );
}
