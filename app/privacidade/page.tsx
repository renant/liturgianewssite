import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Entenda como coletamos, armazenamos e utilizamos os dados dos inscritos na LiturgiaNews e como solicitar remoção.",
  alternates: {
    canonical: "https://www.liturgianews.site/privacidade",
  },
  openGraph: {
    title: "Política de Privacidade",
    description:
      "Saiba como seus dados são tratados na LiturgiaNews e como solicitar remoção.",
    type: "website",
    url: "https://www.liturgianews.site/privacidade",
  },
};

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
          Não vendemos, compartilhamos ou utilizamos seus dados para fins
          publicitários de terceiros.
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
