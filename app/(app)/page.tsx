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
          <Cross className="w-10 h-10 text-amber-800" aria-label="Cruz cristã" />
        </div>

        {/* Main heading section */}
        <header className="space-y-6">
          <h1 className="text-3xl font-serif font-bold text-foreground md:text-4xl tracking-tight">
            Newsletter da Liturgia Católica Diária
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Receba a liturgia católica diária em seu e-mail todas as manhãs.
          </p>
        </header>

        {/* Newsletter signup section */}
        <section aria-label="Inscrição na newsletter">
          <NewsletterFormSignup />
        </section>

        {/* Navigation links */}
        <nav aria-label="Links úteis" className="space-y-6">
          <p className="text-base text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Link
              href="/liturgia/hoje"
              className="text-base font-medium text-amber-700 underline hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
              aria-label="Visite a liturgia diária de hoje"
            >
              📖 Liturgia de hoje
            </Link>
            <Link
              href="/liturgia"
              className="text-base font-medium text-amber-700 underline hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
              aria-label="Veja todas as liturgias"
            >
              📚 Ver todas as liturgias
            </Link>
          </p>
        </nav>

        {/* Footer section */}
        <footer className="space-y-3 pt-4">
          <p className="text-sm text-muted-foreground mt-4">
            Comece cada dia com a Palavra de Deus. Cancele quando quiser.
          </p>
          <p className="text-sm text-muted-foreground">
            Aceitamos sugestões, críticas ou dúvidas. Compartilhe também seu
            testemunho para futuras edições.
          </p>
          <div className="flex flex-col items-center gap-2 mt-6">
            <Link
              href="/contact"
              className="text-sm font-medium text-amber-700 underline hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
              aria-label="Entre em contato conosco"
            >
              Fale conosco
            </Link>
          </div>
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
