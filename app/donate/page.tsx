import JsonLd from "@/components/jsonld/JsonLd";
import { Button } from "@/components/ui/button";
import livePixImage from "@/public/livepix.png";
import { ExternalLink, Heart, Mail, Server } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apoie nossa missão",
  description: "Ajude a LiturgiaNews a continuar levando a Palavra de Deus através da liturgia diária para milhares de fiéis. Faça sua doação e apoie nossa missão evangelizadora.",
  alternates: {
    canonical: "https://www.liturgianews.site/donate",
  },
  openGraph: {
    title: "Apoie nossa missão",
    description: "Ajude-nos a continuar nossa missão de evangelização através da liturgia diária",
    type: "website",
    url: "https://www.liturgianews.site/donate",
  },
};

export default function Donate() {
  return (
    <>
      <div className="page-container space-y-8">
        <header className="page-header">
          <h1 className="page-title">
            Apoie Nossa Missão
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Ajude-nos a continuar levando a Palavra de Deus e as leituras diárias
            da liturgia para milhares de fiéis.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <section className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Por que precisamos do seu apoio?
              </h2>
              <ul className="space-y-4" role="list">
                <li className="flex items-start space-x-3">
                  <Server
                    className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0"
                    aria-label="Servidores"
                  />
                  <span className="text-muted-foreground">
                    Manutenção dos servidores para garantir que as newsletters
                    cheguem pontualmente todos os dias
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail
                    className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0"
                    aria-label="E-mail"
                  />
                  <span className="text-muted-foreground">
                    Custos com serviços de email para enviar newsletters
                    diariamente
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Heart
                    className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0"
                    aria-label="Apoio"
                  />
                  <span className="text-muted-foreground">
                    Desenvolvimento contínuo para melhorar a experiência dos
                    nossos leitores
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Como doar?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Você pode fazer sua doação através do LivePix escaneando o QR Code
                abaixo ou abrindo o LivePix pelo botão.
              </p>
              <Button
                className="bg-amber-700 hover:bg-amber-800 text-white inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                asChild
              >
                <Link 
                  href="https://livepix.gg/liturgianews" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Doar agora via LivePix (abre em nova janela)"
                >
                  Doar Agora
                  <ExternalLink
                    className="w-4 h-4 ml-2"
                    aria-label="Abrir em nova janela"
                  />
                </Link>
              </Button>
            </div>
          </section>

          <aside className="flex flex-col items-center space-y-4">
            <div className="rounded-lg border border-amber-200/70 bg-white p-5">
              <Image
                src={livePixImage}
                alt="QR Code para doação via LivePix"
                width={250}
                height={250}
                className="w-full h-auto"
                priority
                placeholder="blur"
              />
            </div>
            <p className="text-sm text-muted-foreground" aria-label="Link do LivePix">livepix.gg/liturgianews</p>
          </aside>
        </div>

        <section className="bg-amber-50 p-8 rounded-lg text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            Agradecemos seu Apoio
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cada doação nos ajuda a continuar nossa missão de levar a Palavra de
            Deus e as leituras diárias da liturgia para mais pessoas. Que Deus
            abençoe sua generosidade!
          </p>
          <blockquote className="pt-4">
            <p className="text-sm text-muted-foreground italic">
              &quot;Cada um dê conforme determinou em seu coração, não com pesar
              ou por obrigação, pois Deus ama quem dá com alegria.&quot;
            </p>
            <cite className="text-sm text-muted-foreground mt-2 block not-italic">- 2 Coríntios 9:7</cite>
          </blockquote>
        </section>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DonateAction",
          name: "Doar para LiturgiaNews",
          description: "Apoie a missão da LiturgiaNews de levar a liturgia católica diária para milhares de fiéis",
          url: "https://www.liturgianews.site/donate",
          recipient: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: "https://www.liturgianews.site",
            description: "Newsletter gratuita de liturgia católica diária"
          },
          potentialAction: {
            "@type": "DonateAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://livepix.gg/liturgianews",
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform"
              ]
            }
          }
        }}
      />
    </>
  );
}
