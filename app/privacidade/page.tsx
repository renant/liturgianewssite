import { buildPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de Privacidade",
  description:
    "Entenda como coletamos, armazenamos e utilizamos os dados dos inscritos na LiturgiaNews, o uso de cookies de publicidade (Google AdSense) e como solicitar remoção.",
  path: "/privacidade",
});

export default function Privacidade() {
  return (
    <div className="reading-container space-y-8">
      <header className="page-header">
        <h1 className="page-title">
          Política de Privacidade
        </h1>
        <p className="page-description">
          Transparência, segurança e cuidado com seus dados pessoais são
          compromissos permanentes da LiturgiaNews, em conformidade com a Lei
          Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e com o
          Regulamento Geral sobre a Proteção de Dados (GDPR).
        </p>
      </header>

      <section className="space-y-4" aria-label="Coleta de dados">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          1. Quais dados coletamos
        </h2>
        <ul className="space-y-3 text-muted-foreground leading-relaxed" role="list">
          <li>
            <span className="font-medium text-foreground">Newsletter (Dupla Confirmação)</span>:
            coletamos exclusivamente o seu endereço de e-mail quando você
            preenche voluntariamente o formulário de inscrição. Utilizamos o
            protocolo de dupla confirmação (<em>double opt-in</em>), enviando a
            liturgia diária apenas após você clicar no link de validação no seu
            e-mail.
          </li>
          <li>
            <span className="font-medium text-foreground">Formulário de Contato</span>:
            quando você nos envia uma mensagem pela página de contato,
            coletamos seu nome, endereço de e-mail, assunto e o conteúdo da
            mensagem exclusivamente para responder à sua solicitação.
          </li>
          <li>
            <span className="font-medium text-foreground">Dados de Navegação e Métricas Técnicas</span>:
            coletamos dados agregados e anonimizados de desempenho de página
            (como tempo de carregamento e visualizações de páginas) para
            identificar erros técnicos e aprimorar a experiência de leitura.
          </li>
        </ul>
      </section>

      <section className="space-y-4" aria-label="Uso e armazenamento">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          2. Como usamos e armazenamos seus dados
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Usamos os dados fornecidos nos formulários exclusivamente para enviar
          a newsletter diária, confirmar sua inscrição e responder às suas
          mensagens de suporte ou dúvidas. O envio de e-mails é processado por
          um provedor de infraestrutura especializado (Resend), que armazena os
          contatos e registros técnicos necessários para a entrega segura e o
          respeito imediato ao cancelamento de inscrição (<em>unsubscribe</em>).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Não vendemos, alugamos nem compartilhamos seu endereço de e-mail ou
          os dados informados nos formulários de newsletter e contato com
          anunciantes ou terceiros para fins comerciais.
        </p>
      </section>

      <section className="space-y-4" aria-label="Publicidade e cookies">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          3. Publicidade e cookies (Google AdSense)
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Para manter o acesso à liturgia diária e ao acervo bíblico totalmente
          gratuito, as páginas do portal exibem blocos discretos de publicidade
          fornecidos pelo <strong>Google AdSense</strong>. Fornecedores
          terceiros, incluindo o Google, utilizam cookies (como o cookie
          DoubleClick / DART e identificadores equivalentes de navegador) para
          veicular anúncios com base nas visitas anteriores do usuário a este
          site ou a outros sites na internet, bem como anúncios contextuais
          relacionados ao tema da página exibida.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Com o uso de cookies de publicidade, o Google e seus parceiros podem
          exibir anúncios personalizados ou não personalizados conforme as suas
          preferências e a legislação aplicável na sua região (incluindo Brasil,
          nos termos da LGPD, e Espaço Econômico Europeu, Reino Unido e Suíça,
          nos termos do GDPR). Você pode gerenciar ou revogar seu consentimento
          e desativar a publicidade personalizada a qualquer momento acessando
          as{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Configurações de anúncios do Google
          </a>{" "}
          (ou acessando{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            aboutads.info
          </a>
          ) e consultar detalhadamente{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            como o Google utiliza dados em sites e aplicativos parceiros
          </a>
          . Você também pode configurar seu navegador para recusar todos os
          cookies ou indicar quando um cookie está sendo enviado.
        </p>
      </section>

      <section className="space-y-4" aria-label="Remoção de dados">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          4. Direitos do titular e como solicitar remoção
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Nos termos da LGPD, você tem direito de confirmar a existência de
          tratamento, acessar, corrigir ou solicitar a exclusão definitiva dos
          seus dados pessoais. Você pode cancelar o recebimento da newsletter a
          qualquer momento clicando no link de descadastramento presente no
          rodapé de todos os e-mails enviados.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Caso deseje a remoção completa dos seus registros ou tenha qualquer
          dúvida sobre esta Política de Privacidade e nossos{" "}
          <Link href="/termos" className="text-link">
            Termos de Uso
          </Link>
          , entre em contato conosco.
        </p>
        <Link
          href="/contact"
          className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
        >
          Solicitar remoção de dados ou falar com o encarregado
        </Link>
      </section>
    </div>
  );
}
