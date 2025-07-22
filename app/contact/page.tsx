import JsonLd from "@/components/jsonld/JsonLd";
import { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Entre em Contato - LiturgiaNews",
  description: "Entre em contato com a LiturgiaNews. Envie suas dúvidas, sugestões ou testemunhos. Estamos aqui para ajudar em sua jornada de fé.",
  alternates: {
    canonical: "https://www.liturgianews.site/contact",
  },
  openGraph: {
    title: "Entre em Contato - LiturgiaNews",
    description: "Entre em contato com a equipe da LiturgiaNews. Envie suas dúvidas, sugestões ou testemunhos.",
    type: "website",
  },
};

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-slate-800">
          Entre em Contato
        </h1>
        <p className="text-slate-600 text-lg">
          Estamos aqui para ajudar. Envie-nos sua mensagem e responderemos o
          mais breve possível.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section aria-label="Formulário de contato" className="space-y-6">
          <ContactForm />
        </section>

        <aside className="space-y-8">
          <section className="space-y-4" aria-label="Perguntas frequentes">
            <h2 className="text-xl font-serif font-semibold text-slate-800">
              Perguntas Frequentes
            </h2>
            <dl className="space-y-3">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <dt>
                  <h3 className="font-medium text-slate-700" itemProp="name">
                    Como faço para me inscrever na newsletter?
                  </h3>
                </dt>
                <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-slate-600" itemProp="text">
                    Visite nossa página inicial e preencha o formulário de
                    inscrição com seu e-mail. Você receberá a liturgia diária todas as manhãs.
                  </p>
                </dd>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <dt>
                  <h3 className="font-medium text-slate-700" itemProp="name">
                    Posso cancelar minha inscrição a qualquer momento?
                  </h3>
                </dt>
                <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-slate-600" itemProp="text">
                    Sim, você pode cancelar sua inscrição através do link no
                    rodapé de qualquer e-mail que enviamos. O cancelamento é imediato.
                  </p>
                </dd>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <dt>
                  <h3 className="font-medium text-slate-700" itemProp="name">
                    A newsletter é gratuita?
                  </h3>
                </dt>
                <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-slate-600" itemProp="text">
                    Sim, nossa newsletter é completamente gratuita. Nossa missão é compartilhar a Palavra de Deus com todos.
                  </p>
                </dd>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <dt>
                  <h3 className="font-medium text-slate-700" itemProp="name">
                    Quando recebo os e-mails?
                  </h3>
                </dt>
                <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-slate-600" itemProp="text">
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
          name: "Entre em Contato - LiturgiaNews",
          description: "Página de contato da LiturgiaNews com formulário e perguntas frequentes",
          url: "https://www.liturgianews.site/contact",
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
            url: "https://www.liturgianews.site",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: "Portuguese",
              areaServed: "BR"
            }
          }
        }}
      />
    </div>
  );
}
