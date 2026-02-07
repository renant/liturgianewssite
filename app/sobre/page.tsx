import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre a LiturgiaNews",
  description:
    "Conheca a missao da LiturgiaNews, nossa equipe e o proposito da newsletter diaria de liturgia catolica.",
  alternates: {
    canonical: "https://www.liturgianews.site/sobre",
  },
  openGraph: {
    title: "Sobre a LiturgiaNews",
    description:
      "Conheca a missao, a equipe e o proposito da newsletter diaria de liturgia catolica.",
    type: "website",
  },
};

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Sobre a LiturgiaNews
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Somos uma iniciativa que conecta pessoas a Palavra de Deus com
          fidelidade, simplicidade e constancia.
        </p>
      </header>

      <section className="space-y-4" aria-label="Missao">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Nossa missao
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A LiturgiaNews existe para ajudar voce a rezar e meditar diariamente
          com as leituras oficiais da Igreja. Queremos tornar o acesso a
          liturgia simples, confiavel e sempre disponivel, fortalecendo sua vida
          espiritual e o encontro com Cristo.
        </p>
      </section>

      <section className="space-y-4" aria-label="Newsletter">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Proposito da newsletter
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Nossa newsletter diaria entrega as leituras, salmos e evangelho com um
          formato leve e direto. O objetivo e ajudar voce a comecar o dia com a
          Palavra, sem precisar procurar em varios lugares.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Se ainda nao faz parte, voce pode se inscrever na pagina inicial e
          cancelar quando quiser.
        </p>
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
        >
          Quero receber a liturgia diaria
        </Link>
      </section>
    </div>
  );
}
