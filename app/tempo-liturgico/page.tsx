import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { buildPageMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const title = "O que é o tempo litúrgico";
const description = "Entenda como o ano litúrgico organiza a celebração da vida de Cristo e acompanha a comunidade cristã.";
const path = "/tempo-liturgico";

export const metadata: Metadata = buildPageMetadata({ title, description, path, type: "article" });

export default function Page() {
  return (
    <div className="reading-container space-y-8">
      <Breadcrumbs items={[{ label: title, href: path }]} className="mb-4" />
      <article className="editorial-prose">
        <h1>{title}</h1>
        <p>O ano litúrgico organiza a celebração cristã ao redor da vida, morte e ressurreição de Jesus. Seu ritmo não coincide simplesmente com janeiro a dezembro: ele começa no Advento e atravessa tempos com ênfases próprias.</p>
        <h2>Um caminho ao longo do ano</h2>
        <p>Advento e Natal conduzem à celebração da vinda de Cristo. Quaresma, Semana Santa e Páscoa acompanham o mistério pascal. O Tempo Comum percorre a vida e o ensinamento de Jesus, ajudando a fé a amadurecer no cotidiano.</p>
        <h2>Por que as leituras mudam</h2>
        <p>As leituras são distribuídas para que a comunidade escute diferentes partes da Escritura e acompanhe cada etapa do calendário. No <Link href="/liturgia">calendário litúrgico</Link>, é possível percorrer essas datas e observar sua continuidade.</p>
        <h2>Acompanhe o dia presente</h2>
        <p>A maneira mais concreta de perceber esse ritmo é acompanhar a <Link href="/liturgia/hoje">liturgia de hoje</Link>. Se desejar criar o hábito, <Link href="#newsletter">assine a newsletter gratuita</Link> para receber a leitura de cada manhã.</p>
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
