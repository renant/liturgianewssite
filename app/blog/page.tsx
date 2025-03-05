import { PostCard } from "@/components/post-card/post-card";
import Link from "next/link";
import { getPosts, type PostMetadata } from "./actions";

function getFirstValue(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
  const disabledLinkStyle = "opacity-50 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-slate-800">
            Blog da Liturgia Católica Diária
          </h1>
          <p className="text-slate-600 text-lg">
            Reflexões, ensinamentos e inspiração para sua jornada de fé
          </p>
        </div>

        {searchTerm && (
          <div className="text-center mb-8">
            <p className="text-slate-600">
              Resultados da busca por:{" "}
              <span className="font-medium text-amber-700">{searchTerm}</span>
            </p>
            <Link
              href="/blog"
              className="text-amber-700 hover:text-amber-900 underline text-sm mt-2 inline-block"
            >
              Limpar busca
            </Link>
          </div>
        )}

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: PostMetadata) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Nenhum post encontrado.</p>
            {searchTerm && (
              <Link
                href="/blog"
                className="text-amber-700 hover:text-amber-900 underline mt-4 inline-block"
              >
                Ver todos os posts
              </Link>
            )}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {!isPreviousDisabled && (
              <Link
                href={`/blog?limit=${postsPerPage}&page=${currentPage - 1}${
                  searchTerm ? `&search=${searchTerm}` : ""
                }${sort !== "date_desc" ? `&sort=${sort}` : ""}`}
                className={`${
                  isPreviousDisabled ? disabledLinkStyle : ""
                } inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-amber-200 rounded-md shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                aria-disabled={isPreviousDisabled}
                tabIndex={isPreviousDisabled ? -1 : undefined}
              >
                Anterior
              </Link>
            )}
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-amber-50 border border-amber-200 rounded-md">
              {currentPage} de {totalPages}
            </span>
            {!isNextDisabled && (
              <Link
                href={`/blog?limit=${postsPerPage}&page=${currentPage + 1}${
                  searchTerm ? `&search=${searchTerm}` : ""
                }${sort !== "date_desc" ? `&sort=${sort}` : ""}`}
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
        </div>
        <div className="flex justify-center text-sm text-slate-500">
          Mostrando {posts.length} de {totalPosts} posts
        </div>
      </div>
    </div>
  );
}
