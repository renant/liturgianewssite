import { buildPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre a LiturgiaNews",
  description:
    "Conheça a missão da LiturgiaNews, nossa metodologia editorial, fontes litúrgicas e o propósito da newsletter diária de liturgia católica.",
  path: "/sobre",
});

export default function Sobre() {
  return (
    <div className="reading-container space-y-8">
      <header className="page-header">
        <h1 className="page-title">
          Sobre a LiturgiaNews
        </h1>
        <p className="page-description">
          Somos uma iniciativa editorial católica dedicada a conectar pessoas à
          Palavra de Deus com fidelidade litúrgica, clareza e constância diária.
        </p>
      </header>

      <section className="space-y-4" aria-label="Missão">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Nossa missão
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A <strong>LiturgiaNews</strong> nasceu com o propósito de ajudar fiéis
          leigos, famílias, ministros da Palavra e comunidades a rezarem e
          meditarem diariamente com as leituras oficiais da Igreja Católica.
          Queremos tornar o acesso à{" "}
          <Link href="/liturgia/hoje" className="text-link">
            liturgia diária
          </Link>{" "}
          simples, confiável, organizado e livre de distrações visuais,
          fortalecendo a vida de oração pessoal e o encontro cotidiano com
          Jesus Cristo.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Acreditamos que o contato perseverante com a Sagrada Escritura —
          lida em sintonia com o{" "}
          <Link href="/tempo-liturgico" className="text-link">
            ano litúrgico
          </Link>{" "}
          da Igreja — transforma o coração humano, ilumina as decisões do dia a
          dia e educa para a caridade cristã.
        </p>
      </section>

      <section className="space-y-4" aria-label="Metodologia editorial e fontes">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Metodologia editorial e fontes litúrgicas
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Todo o conteúdo publicado na LiturgiaNews segue rigorosamente a
          ordenação bíblica do{" "}
          <strong>Lecionário Oficial da Igreja Católica no Brasil</strong>{" "}
          (Conferência Nacional dos Bispos do Brasil — CNBB) e as normas do{" "}
          <em>Calendário Romano Geral</em> (Ciclo Dominical Anos A, B e C,
          Ciclo Ferial Anos Pares e Ímpares e Próprio dos Santos).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Para cada dia do calendário, nossa equipe editorial organiza e revisa:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-relaxed">
          <li>
            <strong>As Leituras do Dia:</strong> Primeira Leitura, Salmo
            Responsorial, Segunda Leitura (nos domingos e solenidades),
            Aclamação ao Evangelho e Proclamação do Santo Evangelho.
          </li>
          <li>
            <strong>Reflexão do Evangelho:</strong> Meditações pastorais e
            espirituais próprias, redigidas em linguagem clara e fiel ao
            Catecismo da Igreja Católica e à tradição patrística, conectando a
            Primeira Leitura ao Evangelho proclamado.
          </li>
          <li>
            <strong>Roteiro de Lectio Divina e Formação:</strong> Orientações
            práticas de leitura orante em cada página de liturgia, além de{" "}
            <Link href="/blog" className="text-link">
              artigos de formação litúrgica
            </Link>{" "}
            sobre os tempos sagrados, símbolos e orações da Igreja.
          </li>
        </ul>
      </section>

      <section className="space-y-4" aria-label="Newsletter e sustentabilidade">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Propósito da newsletter e gratuidade
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Nossa newsletter diária entrega gratuitamente as leituras, o salmo, o
          Evangelho e a reflexão do dia diretamente na caixa de entrada dos
          inscritos todas as manhãs. O objetivo é ajudar você a começar o dia
          na presença de Deus, sem precisar procurar as leituras em diferentes
          lugares.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          O acesso ao portal e o recebimento da newsletter são 100% gratuitos.
          Para custear os servidores, o serviço de disparo seguro de e-mails e
          a manutenção técnica do acervo, o projeto conta com o{" "}
          <Link href="/donate" className="text-link">
            apoio espontâneo dos leitores
          </Link>{" "}
          e com a exibição discreta de publicidade nas páginas de leitura,
          sempre respeitando a sobriedade do ambiente de oração e a nossa{" "}
          <Link href="/privacidade" className="text-link">
            Política de Privacidade
          </Link>
          .
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Se ainda não faz parte, você pode se inscrever na página inicial e
          cancelar a assinatura quando quiser com apenas um clique.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/#newsletter"
            className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
          >
            Quero receber a liturgia diária
          </Link>
          <Link
            href="/contact"
            className="inline-flex text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
          >
            Falar com nossa equipe editorial
          </Link>
        </div>
      </section>
    </div>
  );
}
