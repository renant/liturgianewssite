import NewsletterFormSignup from "@/app/(app)/newsletter-sigup-form";
import JsonLd from "@/components/jsonld/JsonLd";
import { Cross } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter da Liturgia Católica Diária | LiturgiaNews",
  description:
    "Receba gratuitamente a liturgia católica diária em seu e-mail. Leituras, salmos, evangelho e reflexões para fortalecer sua fé todas as manhãs.",
  alternates: {
    canonical: "https://www.liturgianews.site",
  },
};

export default function Home() {
  return (
    <>
      <article className="text-center max-w-md mx-auto space-y-8">
        {/* Icon with semantic meaning */}
        <div
          className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center"
          role="img"
          aria-label="Cruz cristã"
        >
          <Cross className="w-10 h-10 text-amber-800" aria-hidden="true" />
        </div>

        {/* Main heading section */}
        <header className="space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-slate-800 md:text-4xl">
            Newsletter da Liturgia Católica Diária
          </h1>
          <p className="text-slate-600 text-lg">
            Receba a liturgia católica diária em seu e-mail todas as manhãs.
          </p>
        </header>

        {/* Newsletter signup section */}
        <section aria-label="Inscrição na newsletter">
          <NewsletterFormSignup />
        </section>

        {/* Telegram channel highlight */}
        <section aria-label="Canal no Telegram" className="flex justify-center">
          <a
            href="https://t.me/liturgianews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-amber-700 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition"
            aria-label="Receba a liturgia diária no nosso canal do Telegram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M21.426 2.574a2.5 2.5 0 0 0-2.48-.6L3.6 6.6a2.5 2.5 0 0 0-.09 4.77l4.44 1.44 1.44 4.44a2.5 2.5 0 0 0 4.77-.09l4.626-15.346a2.5 2.5 0 0 0-.6-2.48zM9.75 14.25l-1.125-3.469 7.594-7.594-6.469 7.594zm1.5 1.5l7.594-7.594-7.594 7.594z" />
            </svg>
            Receba a liturgia diária também no nosso canal do Telegram
          </a>
        </section>

        {/* Navigation links */}
        <nav aria-label="Links úteis" className="space-y-4">
          <p>
            <Link
              href="/liturgia"
              className="text-xs text-amber-700 underline hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Visite nosso blog com artigos e reflexões"
            >
              Visite a liturgia diaria
            </Link>
          </p>
          <p>
            <Link
              href="/blog"
              className="text-xs text-amber-700 underline hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Visite nosso blog com artigos e reflexões"
            >
              Visite nosso blog
            </Link>
          </p>
        </nav>

        {/* Footer section */}
        <footer className="space-y-2">
          <p className="text-xs text-slate-500 mt-4">
            Comece cada dia com a Palavra de Deus. Cancele quando quiser.
          </p>
          <p className="text-xs text-slate-500">
            Aceitamos sugestões, críticas ou dúvidas. Compartilhe também seu
            testemunho para futuras edições.
          </p>
          <p>
            <Link
              href="/contact"
              className="text-xs text-amber-700 underline hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Entre em contato conosco"
            >
              Fale conosco
            </Link>
          </p>
        </footer>
      </article>

      {/* Structured data for the homepage */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsletterService",
          name: "LiturgiaNews - Newsletter da Liturgia Católica Diária",
          description:
            "Serviço de newsletter gratuito que envia a liturgia católica diária por e-mail todas as manhãs",
          url: "https://www.liturgianews.site",
          provider: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
          },
          areaServed: {
            "@type": "Country",
            name: "Brasil",
          },
          inLanguage: "pt-BR",
        }}
      />
    </>
  );
}
