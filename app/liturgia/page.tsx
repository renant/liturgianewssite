import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { CalendarIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { getLiturgia, type LiturgiaMetadata } from "./actions";
import { getLiturgicalDate, MONTH_NAMES } from "@/lib/liturgical-date";

const archiveDescription = "Arquivo completo da liturgia católica diária. Acesse leituras, reflexões e orações de cada dia do ano litúrgico.";

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
    (Boolean(getFirstValue(query.limit)) && Number(getFirstValue(query.limit)) !== 20);
  const canonical = hasFilters || page === 1
    ? "https://www.liturgianews.site/liturgia"
    : `https://www.liturgianews.site/liturgia?page=${page}`;
  return {
    title: "Liturgia Católica Diária - Arquivo",
    description: archiveDescription,
    alternates: { canonical },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: { title: "Liturgia Católica Diária - Arquivo | LiturgiaNews", description: archiveDescription, type: "website", url: canonical },
  };
}

function paginationHref(page: number, limit: number, search: string, sort: string) {
  const query = new URLSearchParams({ page: String(page) });
  if (limit !== 20) query.set("limit", String(limit));
  if (search) query.set("search", search);
  if (sort !== "date_desc") query.set("sort", sort);
  return `/liturgia?${query}`;
}

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
  const disabledLinkStyle = "opacity-50 cursor-not-allowed pointer-events-none";
  const today = getLiturgicalDate();
  const calendarHref = `/liturgia/calendario/${today.year}/${MONTH_NAMES[today.month - 1]}`;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
        <div className="max-w-4xl mx-auto space-y-8 py-12">
          <Breadcrumbs
            items={[{ label: "Liturgia", href: "/liturgia" }]}
            className="mb-4"
          />

          <header className="text-center space-y-4">
            <h1 className="text-3xl font-serif font-semibold text-slate-800">
              Liturgia Católica Diária
            </h1>
            <p className="text-slate-600 text-lg">
              Leituras, reflexões e orações para cada dia
            </p>
            <Link href={calendarHref} className="inline-flex text-amber-700 underline underline-offset-4 hover:text-amber-900">
              Calendário
            </Link>
          </header>

          {searchTerm && (
            <section
              className="text-center mb-8"
              aria-label="Resultados da busca"
            >
              <p className="text-slate-600">
                Resultados da busca por:{" "}
                <span className="font-medium text-amber-700">{searchTerm}</span>
              </p>
              <Link
                href="/liturgia"
                className="text-amber-700 hover:text-amber-900 underline text-sm mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Limpar busca
              </Link>
            </section>
          )}

          <main>
            {liturgias.length > 0 ? (
              <section aria-label="Lista de liturgias" className="space-y-6">
                {liturgias.map((item: LiturgiaMetadata) => (
                  <article
                    key={item.slug}
                    className="border-b border-amber-100 pb-4 mb-4 last:border-b-0 last:mb-0"
                    itemScope
                    itemType="https://schema.org/Article"
                  >
                    <h2 className="text-xl font-semibold text-slate-800">
                      <Link
                        href={`/liturgia/${item.slug}`}
                        className="hover:underline text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        itemProp="url"
                      >
                        <span itemProp="headline">{item.title}</span>
                      </Link>
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <CalendarIcon className="w-4 h-4" aria-label="Data da liturgia" />
                      <time
                        dateTime={item.date.toString()}
                        itemProp="datePublished"
                      ></time>
                      {item.formattedDate}
                    </div>
                    <meta itemProp="inLanguage" content="pt-BR" />
                    <meta itemProp="author" content="LiturgiaNews" />
                  </article>
                ))}
              </section>
            ) : (
              <section
                className="text-center py-12"
                aria-label="Nenhum resultado"
              >
                <p className="text-slate-600 text-lg">
                  Nenhuma liturgia encontrada.
                </p>
                {searchTerm && (
                  <Link
                    href="/liturgia"
                    className="text-amber-700 hover:text-amber-900 underline mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Ver todas as liturgias
                  </Link>
                )}
              </section>
            )}
          </main>

          <nav aria-label="Paginação" className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {!isPreviousDisabled && (
                <Link
                  href={paginationHref(currentPage - 1, itemsPerPage, searchTerm, sort)}
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
                  href={paginationHref(currentPage + 1, itemsPerPage, searchTerm, sort)}
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

          <p
            className="text-center text-sm text-slate-500"
            aria-label={`Mostrando ${liturgias.length} de ${totalLiturgias} liturgias`}
          >
            Mostrando {liturgias.length} de {totalLiturgias} liturgias
          </p>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Arquivo de Liturgia Católica Diária",
          description:
            "Arquivo completo da liturgia católica diária com leituras, reflexões e orações",
          url: "https://www.liturgianews.site/liturgia",
          inLanguage: "pt-BR",
          isPartOf: {
            "@type": "WebSite",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site",
          },
          hasPart: liturgias.map((liturgia) => ({
            "@type": "Article",
            headline: liturgia.title,
            datePublished: liturgia.date,
            url: `https://www.liturgianews.site/liturgia/${liturgia.slug}`,
            author: {
              "@type": "Organization",
              name: "LiturgiaNews",
            },
          })),
          provider: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site",
          },
        }}
      />
    </>
  );
}
