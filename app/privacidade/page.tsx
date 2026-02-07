import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de Privacidade - LiturgiaNews",
  description:
    "Entenda como coletamos, armazenamos e utilizamos os dados dos inscritos na LiturgiaNews e como solicitar remocao.",
  alternates: {
    canonical: "https://www.liturgianews.site/privacidade",
  },
  openGraph: {
    title: "Politica de Privacidade - LiturgiaNews",
    description:
      "Saiba como seus dados sao tratados na LiturgiaNews e como solicitar remocao.",
    type: "website",
  },
};

export default function Privacidade() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Politica de Privacidade
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Transparencia e cuidado com seus dados sao essenciais para a
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
            coletamos seu e-mail para enviar a liturgia diaria e confirmar sua
            inscricao.
          </li>
          <li>
            <span className="font-medium text-foreground">Contato</span>:
            quando voce envia uma mensagem, coletamos nome, e-mail, assunto e o
            conteudo informado.
          </li>
        </ul>
      </section>

      <section className="space-y-4" aria-label="Uso e armazenamento">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Como usamos e armazenamos
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Usamos seus dados exclusivamente para enviar a newsletter, confirmar a
          inscricao e responder suas solicitacoes. O envio de e-mails e
          realizado por um provedor especializado (Resend), que armazena os
          contatos e registros necessarios para o envio seguro.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Nao vendemos, compartilhamos ou utilizamos seus dados para fins
          publicitarios de terceiros.
        </p>
      </section>

      <section className="space-y-4" aria-label="Remocao de dados">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Como solicitar remocao
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Voce pode cancelar a newsletter a qualquer momento usando o link no
          rodape dos e-mails enviados. Caso queira a remocao completa dos seus
          dados ou tenha alguma duvida, entre em contato conosco.
        </p>
        <Link
          href="/contact"
          className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
        >
          Solicitar remocao de dados
        </Link>
      </section>
    </div>
  );
}
