import { buildPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de Privacidade",
  description:
    "Entenda como coletamos, armazenamos e utilizamos os dados dos inscritos na LiturgiaNews e como solicitar remoção.",
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
          Transparência e cuidado com seus dados são essenciais para a
          LiturgiaNews.
        </p>
      </header>

      <section className="space-y-4" aria-label="Coleta de dados">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Quais dados coletamos
        </h2>
        <ul className="space-y-3 text-muted-foreground" role="list">
          <li>
            <span className="font-medium text-foreground">Newsletter</span>:
            coletamos seu e-mail para enviar a liturgia diária e confirmar sua
            inscrição.
          </li>
          <li>
            <span className="font-medium text-foreground">Contato</span>:
            quando você envia uma mensagem, coletamos nome, e-mail, assunto e o
            conteúdo informado.
          </li>
        </ul>
      </section>

      <section className="space-y-4" aria-label="Uso e armazenamento">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Como usamos e armazenamos
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Usamos seus dados exclusivamente para enviar a newsletter, confirmar a
          inscrição e responder suas solicitações. O envio de e-mails é
          realizado por um provedor especializado (Resend), que armazena os
          contatos e registros necessários para o envio seguro.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Não vendemos, alugamos nem compartilhamos seu e-mail ou os dados
          informados nos formulários de newsletter e contato com anunciantes ou
          terceiros para fins comerciais.
        </p>
      </section>

      <section className="space-y-4" aria-label="Publicidade e cookies">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Publicidade e cookies (Google AdSense)
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Para manter o acesso à liturgia diária gratuito, as páginas de leitura
          exibem blocos discretos de publicidade fornecidos pelo Google AdSense.
          Terceiros, incluindo o Google, podem utilizar cookies e
          identificadores de navegador para exibir anúncios com base em visitas
          anteriores a este ou a outros sites na internet, ou anúncios
          contextuais relacionados ao conteúdo exibido.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Nas regiões aplicáveis (como Brasil, nos termos da LGPD, e Espaço
          Econômico Europeu, nos termos do GDPR), você pode gerenciar suas
          preferências de consentimento diretamente pelo aviso de privacidade
          apresentado no site. Você também pode desativar a publicidade
          personalizada a qualquer momento acessando as{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Configurações de anúncios do Google
          </a>{" "}
          e consultar{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            como o Google utiliza dados em sites e aplicativos parceiros
          </a>
          .
        </p>
      </section>

      <section className="space-y-4" aria-label="Remoção de dados">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Como solicitar remoção
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Você pode cancelar a newsletter a qualquer momento usando o link no
          rodapé dos e-mails enviados. Caso queira a remoção completa dos seus
          dados ou tenha alguma dúvida, entre em contato conosco.
        </p>
        <Link
          href="/contact"
          className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
        >
          Solicitar remoção de dados
        </Link>
      </section>
    </div>
  );
}
