import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre a LiturgiaNews",
  description:
    "Conheça a missão da LiturgiaNews, nossa equipe e o propósito da newsletter diária de liturgia católica.",
  alternates: {
    canonical: "https://www.liturgianews.site/sobre",
  },
  openGraph: {
    title: "Sobre a LiturgiaNews",
    description:
      "Conheça a missão, a equipe e o propósito da newsletter diária de liturgia católica.",
    type: "website",
    url: "https://www.liturgianews.site/sobre",
  },
};

export default function Sobre() {
  return (
    <div className="reading-container space-y-8">
      <header className="page-header">
        <h1 className="page-title">
          Sobre a LiturgiaNews
        </h1>
        <p className="page-description">
          Somos uma iniciativa que conecta pessoas à Palavra de Deus com
          fidelidade, simplicidade e constância.
        </p>
      </header>

      <section className="space-y-4" aria-label="Missão">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Nossa missão
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A LiturgiaNews existe para ajudar você a rezar e meditar diariamente
          com as leituras oficiais da Igreja. Queremos tornar o acesso à
          liturgia simples, confiável e sempre disponível, fortalecendo sua vida
          espiritual e o encontro com Cristo.
        </p>
      </section>

      <section className="space-y-4" aria-label="Newsletter">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Propósito da newsletter
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Nossa newsletter diária entrega as leituras, salmos e evangelho com um
          formato leve e direto. O objetivo é ajudar você a começar o dia com a
          Palavra, sem precisar procurar em vários lugares.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Se ainda não faz parte, você pode se inscrever na página inicial e
          cancelar quando quiser.
        </p>
        <Link
          href="/#newsletter"
          className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
        >
          Quero receber a liturgia diária
        </Link>
      </section>
    </div>
  );
}
