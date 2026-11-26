import JsonLd from "@/components/jsonld/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./contact-form";

export const metadata: Metadata = buildPageMetadata({
  title: "Entre em contato",
  description: "Entre em contato com a LiturgiaNews. Envie suas dúvidas, sugestões ou testemunhos. Estamos aqui para ajudar em sua jornada de fé.",
  path: "/contact",
});

export default function Contact() {
  return (
    <div className="page-container space-y-8">
      <header className="page-header">
        <h1 className="page-title">
          Entre em contato
        </h1>
        <p className="page-description">
          Fale com a equipe da LiturgiaNews: envie dúvidas, sugestões ou o aviso
          de um erro que você encontrou. Respondemos o mais breve possível.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section aria-label="Formulário de contato" className="space-y-6">
          <ContactForm />
        </section>

        <aside className="space-y-8">
          <section className="space-y-3" aria-label="Sobre o contato">
            <h2 className="text-xl font-serif font-semibold text-foreground">
              Antes de escrever
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A <strong>LiturgiaNews</strong> é um portal católico independente
              que publica a liturgia diária, reflexões e artigos de formação.
              O contato é feito pelo formulário desta página.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Para avisar de um erro, informe o endereço da página e o trecho.
              Veja como conferimos e corrigimos o conteúdo na{" "}
              <Link href="/politica-editorial" className="text-link">
                política editorial
              </Link>
              . As leituras seguem o Lecionário da CNBB, conferidas com a
              liturgia diária da Canção Nova.
            </p>
          </section>
          <section className="space-y-4" aria-label="Perguntas frequentes">
            <h2 className="text-xl font-serif font-semibold text-foreground">
              Perguntas frequentes
            </h2>
            <dl className="space-y-3">
              <div>
                <dt>
                  <h3 className="font-medium text-foreground">
                    Como faço para me inscrever na newsletter?
                  </h3>
                </dt>
                <dd>
                  <p className="text-muted-foreground leading-relaxed">
                    Visite nossa página inicial e preencha o formulário de
                    inscrição com seu e-mail. Você receberá a liturgia diária todas as manhãs.
                  </p>
                </dd>
              </div>
              <div>
                <dt>
                  <h3 className="font-medium text-foreground">
                    Posso cancelar minha inscrição a qualquer momento?
                  </h3>
                </dt>
                <dd>
                  <p className="text-muted-foreground leading-relaxed">
                    Sim, você pode cancelar sua inscrição através do link no
                    rodapé de qualquer e-mail que enviamos. O cancelamento é imediato.
                  </p>
                </dd>
              </div>
              <div>
                <dt>
                  <h3 className="font-medium text-foreground">
                    A newsletter é gratuita?
                  </h3>
                </dt>
                <dd>
                  <p className="text-muted-foreground leading-relaxed">
                    Sim, nossa newsletter é completamente gratuita. Nossa missão é compartilhar a Palavra de Deus com todos.
                  </p>
                </dd>
              </div>
              <div>
                <dt>
                  <h3 className="font-medium text-foreground">
                    Quando recebo os e-mails?
                  </h3>
                </dt>
                <dd>
                  <p className="text-muted-foreground leading-relaxed">
                    Você receberá a liturgia diária todas as manhãs, geralmente entre 6h e 7h da manhã.
                  </p>
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["ContactPage", "FAQPage"],
          name: "Entre em contato",
          description: "Página de contato da LiturgiaNews com formulário e perguntas frequentes",
          url: `${SITE_URL}/contact`,
          mainEntity: [
            {
              "@type": "Question",
              name: "Como faço para me inscrever na newsletter?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Visite nossa página inicial e preencha o formulário de inscrição com seu e-mail. Você receberá a liturgia diária todas as manhãs.",
              },
            },
            {
              "@type": "Question",
              name: "Posso cancelar minha inscrição a qualquer momento?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sim, você pode cancelar sua inscrição através do link no rodapé de qualquer e-mail que enviamos. O cancelamento é imediato.",
              },
            },
            {
              "@type": "Question",
              name: "A newsletter é gratuita?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sim, nossa newsletter é completamente gratuita. Nossa missão é compartilhar a Palavra de Deus com todos.",
              },
            },
            {
              "@type": "Question",
              name: "Quando recebo os e-mails?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Você receberá a liturgia diária todas as manhãs, geralmente entre 6h e 7h da manhã.",
              },
            },
          ],
          provider: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: SITE_URL,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: "Portuguese",
              areaServed: "BR",
            },
          },
        }}
      />
    </div>
  );
}
