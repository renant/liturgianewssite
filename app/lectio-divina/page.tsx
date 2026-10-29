import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { buildPageMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const title = "Lectio divina: o que é e como fazer";
const description = "Conheça um roteiro prático de leitura, meditação, oração e contemplação da Palavra.";
const path = "/lectio-divina";

export const metadata: Metadata = buildPageMetadata({ title, description, path, type: "article" });

export default function Page() {
  return (
    <div className="reading-container space-y-8">
      <Breadcrumbs items={[{ label: title, href: path }]} className="mb-4" />
      <article className="editorial-prose">
        <h1>{title}</h1>
        <p>Lectio divina é uma forma orante de se aproximar da Escritura. Seu objetivo não é estudar o maior número possível de páginas, mas acolher o texto, responder a ele em oração e deixar que ilumine a vida.</p>
        <h2>Leitura e meditação</h2>
        <p>Leia o trecho devagar, mais de uma vez. Observe quem fala, o que acontece e quais palavras se repetem. Depois pergunte o que esse texto revela e onde ele encontra sua experiência atual. A <Link href="/liturgia/hoje">liturgia de hoje</Link> oferece um ponto de partida diário.</p>
        <h2>Oração e contemplação</h2>
        <p>Responda com palavras simples: agradeça, peça ajuda ou apresente uma inquietação. Em seguida, permaneça alguns instantes em silêncio. Não é necessário produzir uma sensação especial; basta ficar disponível diante de Deus.</p>
        <h2>Levar a Palavra para o dia</h2>
        <p>Conclua escolhendo uma atitude possível, coerente com o que leu. Se a regularidade ajudar, você pode <Link href="#newsletter">receber a liturgia diária por e-mail</Link> e reservar esse encontro para o começo da manhã.</p>
      </article>
      <NewsletterPanel />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: [DEFAULT_OG_IMAGE.url],
          author: { "@type": "Organization", name: "LiturgiaNews", url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: SITE_URL,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/android-chrome-192x192.png`, width: 192, height: 192 },
          },
          mainEntityOfPage: `${SITE_URL}${path}`,
          inLanguage: "pt-BR",
        }}
      />
    </div>
  );
}
