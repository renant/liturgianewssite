import { buildPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Termos de Uso",
  description:
    "Conheça os Termos e Condições de Uso do portal e da newsletter diária gratuita da LiturgiaNews.",
  path: "/termos",
});

export default function Termos() {
  return (
    <div className="reading-container space-y-8">
      <header className="page-header">
        <h1 className="page-title">Termos de Uso</h1>
        <p className="page-description">
          Condições gerais de utilização do portal, do calendário litúrgico e
          da newsletter diária gratuita da LiturgiaNews.
        </p>
      </header>

      <section className="space-y-4" aria-label="Objetivo do portal">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          1. Finalidade do serviço
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A <strong>LiturgiaNews</strong> (<code>liturgianews.site</code>) é um
          portal católico independente de caráter espiritual, formativo e
          informativo que disponibiliza gratuitamente as leituras diárias da
          liturgia católica, reflexões do Evangelho, guias de oração (
          <em>Lectio Divina</em>) e o envio matinal da liturgia por e-mail. Ao
          acessar e utilizar este site, você concorda com estes Termos de Uso e
          com a nossa{" "}
          <Link href="/privacidade" className="text-link">
            Política de Privacidade
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4" aria-label="Conteúdo e direitos autorais">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          2. Conteúdo bíblico, litúrgico e editorial
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          As referências e os textos bíblicos proclamados na liturgia seguem a
          organização do Lecionário Oficial da Igreja Católica no Brasil,
          destinando-se exclusivamente à oração pessoal, meditação comunitária e
          preparação pastoral, sem qualquer finalidade de comercialização dos
          textos sagrados.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Os artigos originais do{" "}
          <Link href="/blog" className="text-link">
            Blog
          </Link>
          , os guias de formação, as reflexões pastorais e a estrutura visual do
          portal são produzidos pela equipe editorial da LiturgiaNews. É
          permitido compartilhar links e citar trechos para fins pastorais,
          catequéticos ou não comerciais, desde que citada a fonte com link para
          a página original.
        </p>
      </section>

      <section className="space-y-4" aria-label="Inscrição na newsletter">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          3. Uso da newsletter gratuita
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A inscrição na newsletter diária requer um endereço de e-mail válido e
          pertencente ao próprio usuário, confirmado por meio de mensagem de
          validação (<em>double opt-in</em>). O usuário compromete-se a não
          cadastrar e-mails de terceiros sem autorização. O cancelamento pode
          ser feito a qualquer momento pelo link de descadastramento presente no
          rodapé de todos os e-mails enviados.
        </p>
      </section>

      <section className="space-y-4" aria-label="Links externos e publicidade">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          4. Links externos e publicidade
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Nossas páginas podem conter links de referência para fontes oficiais
          da Igreja (como o portal <em>Vatican News</em> e a Santa Sé), bem
          como espaços publicitários gerenciados pelo Google AdSense para
          sustentar a gratuidade do projeto. A LiturgiaNews não controla nem se
          responsabiliza pelas práticas de privacidade ou conteúdos de sites de
          terceiros acessados por meio de links externos.
        </p>
      </section>

      <section className="space-y-4" aria-label="Contato e atualizações">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          5. Contato e alterações destes termos
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Podemos atualizar estes Termos de Uso periodicamente para refletir
          melhorias no portal ou exigências legais. Em caso de dúvidas,
          sugestões ou solicitações, utilize nossa{" "}
          <Link href="/contact" className="text-link">
            página de contato
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
