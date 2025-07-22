import Link from "next/link";
import { getLiturgia, type LiturgiaMetadata } from "./actions";

function getFirstValue(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LiturgiaPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(getFirstValue(searchParams.page)) || 1;
  const itemsPerPage = Number(getFirstValue(searchParams.limit)) || 20;
  const sort = getFirstValue(searchParams.sort) || "date_desc";
  const searchTerm = getFirstValue(searchParams.search);

  const { liturgias, totalLiturgias } = await getLiturgia({
    limit: itemsPerPage,
    page: currentPage,
    searchTerm,
    sort,
  });

  const totalPages = Math.ceil(totalLiturgias / itemsPerPage);

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;
  const disabledLinkStyle = "opacity-50 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-slate-800">
            Liturgia Católica Diária
          </h1>
          <p className="text-slate-600 text-lg">
            Leituras, reflexões e orações para cada dia
          </p>
        </div>

        {searchTerm && (
          <div className="text-center mb-8">
            <p className="text-slate-600">
              Resultados da busca por:{" "}
              <span className="font-medium text-amber-700">{searchTerm}</span>
            </p>
            <Link
              href="/liturgia"
              className="text-amber-700 hover:text-amber-900 underline text-sm mt-2 inline-block"
            >
              Limpar busca
            </Link>
          </div>
        )}

        {liturgias.length > 0 ? (
          <div className="space-y-6">
            {liturgias.map((item: LiturgiaMetadata) => (
              <div
                key={item.slug}
                className="border-b border-amber-100 pb-4 mb-4 last:border-b-0 last:mb-0"
              >
                <h2 className="text-xl font-semibold text-slate-800">
                  <Link
                    href={`/liturgia/${item.slug}`}
                    className="hover:underline text-amber-700"
                  >
                    {item.title}
                  </Link>
                </h2>
                <div className="text-sm text-slate-500 mb-1">
                  {item.formattedDate}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              Nenhuma liturgia encontrada.
            </p>
            {searchTerm && (
              <Link
                href="/liturgia"
                className="text-amber-700 hover:text-amber-900 underline mt-4 inline-block"
              >
                Ver todas as liturgias
              </Link>
            )}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {!isPreviousDisabled && (
              <Link
                href={`/liturgia?limit=${itemsPerPage}&page=${currentPage - 1}${
                  searchTerm ? `&search=${searchTerm}` : ""
                }${sort !== "date_desc" ? `&sort=${sort}` : ""}`}
                className={`$${
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
                href={`/liturgia?limit=${itemsPerPage}&page=${currentPage + 1}${
                  searchTerm ? `&search=${searchTerm}` : ""
                }${sort !== "date_desc" ? `&sort=${sort}` : ""}`}
                className={`$${
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
          Mostrando {liturgias.length} de {totalLiturgias} liturgias
        </div>
      </div>
    </div>
  );
}
