import { buildPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Política editorial",
  description:
    "Fontes, método de escrita e revisão, correção de erros, independência e anúncios: como a LiturgiaNews produz a liturgia diária, as reflexões e os artigos.",
  path: "/politica-editorial",
});

const sources = [
  {
    name: "Lecionário da CNBB",
    text: "Ordem e referências das leituras de cada dia, conforme a Igreja no Brasil.",
    href: null,
  },
  {
    name: "Liturgia diária da Canção Nova",
    text: "Conferência das leituras e do Evangelho publicados em cada dia.",
    href: "https://liturgia.cancaonova.com/pb/",
  },
  {
    name: "Catecismo da Igreja Católica",
    text: "Referência doutrinária, citada por parágrafo, no Vaticano.",
    href: "https://www.vatican.va/archive/catechism_po/index_po.htm",
  },
  {
    name: "Vatican News",
    text: "Notícias e comunicados oficiais da Santa Sé.",
    href: "https://www.vaticannews.va/pt.html",
  },
  {
    name: "Documentos do Vaticano",
    text: "Constituições conciliares, instruções e normas, como a Sacrosanctum Concilium, a Dei Verbum e a Instrução Geral do Missal Romano.",
    href: "https://www.vatican.va/content/vatican/pt.html",
  },
];

export default function PoliticaEditorial() {
  return (
    <div className="reading-container space-y-8">
      <header className="page-header">
        <h1 className="page-title">Política editorial</h1>
        <p className="page-description">
          Como a LiturgiaNews escolhe as fontes, escreve, revisa e corrige o
          que publica.
        </p>
      </header>

      <section className="space-y-4" aria-label="Fontes">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Fontes que usamos
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Trabalhamos com fontes católicas conhecidas e dizemos de onde vem
          cada coisa:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-relaxed">
          {sources.map((source) => (
            <li key={source.name}>
              <strong>
                {source.href ? (
                  <a
                    href={source.href}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
              </strong>
              : {source.text}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Quando uma afirmação doutrinária entra em um texto nosso, ela deve
          poder ser conferida em uma dessas fontes. Se não encontramos apoio
          nelas, não publicamos.
        </p>
      </section>

      <section className="space-y-4" aria-label="Liturgia diária">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Liturgia diária
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          As leituras de cada dia seguem o Lecionário da CNBB e são conferidas
          com a liturgia diária da Canção Nova. Em cada página, o bloco
          &ldquo;Fonte e revisão&rdquo; repete essa informação. A data
          litúrgica é calculada no horário de Brasília.
        </p>
      </section>

      <section className="space-y-4" aria-label="Reflexões e artigos">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Reflexões e artigos
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          As reflexões do Evangelho e os artigos do{" "}
          <Link href="/blog" className="text-link">
            blog
          </Link>{" "}
          são escritos e revisados pela equipe da LiturgiaNews a partir das
          fontes citadas acima. Cada reflexão parte do Evangelho do dia e da
          sua ligação com a primeira leitura e o tempo litúrgico. Os artigos de
          formação encerram, em regra, com as referências aos documentos da
          Igreja usados no texto.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Não tratamos de polêmica política e não apresentamos opinião pessoal
          como ensino da Igreja.
        </p>
      </section>

      <section className="space-y-4" aria-label="Correção de erros">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Como corrigimos erros
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Se você encontrar um erro numa leitura, numa referência bíblica, numa
          data ou em qualquer afirmação, envie pelo{" "}
          <Link href="/contact" className="text-link">
            formulário de contato
          </Link>{" "}
          com o endereço da página e o trecho. Conferimos o ponto com as fontes
          acima e, se o erro se confirmar, corrigimos o texto na própria
          página.
        </p>
      </section>

      <section className="space-y-4" aria-label="Independência e anúncios">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Independência e anúncios
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A LiturgiaNews é um portal independente. Não é um site oficial da
          CNBB, da Santa Sé nem de qualquer diocese.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Para manter o portal gratuito, exibimos publicidade do Google AdSense
          nas páginas de leitura e aceitamos o{" "}
          <Link href="/donate" className="text-link">
            apoio espontâneo dos leitores
          </Link>
          . Os anúncios são identificados como publicidade e não influenciam o
          que escrevemos. Detalhes sobre cookies e dados estão na{" "}
          <Link href="/privacidade" className="text-link">
            Política de Privacidade
          </Link>
          .
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Para saber mais sobre o projeto, veja a página{" "}
          <Link href="/sobre" className="text-link">
            Sobre
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
