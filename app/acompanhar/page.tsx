import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { buildPageMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const title = "Como acompanhar a liturgia diária";
const description = "Um caminho simples para ler as leituras do dia com atenção, oração e constância.";
const path = "/acompanhar";

export const metadata: Metadata = buildPageMetadata({ title, description, path, type: "article" });

export default function Page() {
  return (
    <div className="reading-container space-y-8">
      <Breadcrumbs items={[{ label: title, href: path }]} className="mb-4" />
      <article className="editorial-prose">
        <h1>{title}</h1>
        <p>A liturgia diária aproxima a vida comum das leituras celebradas pela Igreja. Não é preciso transformar esse encontro em uma tarefa longa: constância e atenção costumam ser mais úteis do que pressa para terminar.</p>
        <h2>Prepare um momento possível</h2>
        <p>Escolha um horário que caiba de verdade na rotina e reduza as distrações por alguns minutos. Comece observando a data e o tempo litúrgico, depois leia os textos na ordem em que aparecem. Você pode abrir agora a <Link href="/liturgia/hoje">liturgia de hoje</Link>.</p>
        <h2>Leia, escute e guarde uma frase</h2>
        <p>Faça uma primeira leitura para compreender o texto. Na segunda, perceba uma palavra, uma imagem ou um convite que se destaca. Guardar uma única frase ao longo do dia ajuda a leitura a chegar às decisões concretas.</p>
        <h2>Crie continuidade</h2>
        <p>Retomar as leituras todos os dias permite reconhecer temas e movimentos que uma leitura isolada não mostra. Para receber esse lembrete pela manhã, <Link href="#newsletter">assine gratuitamente a newsletter</Link>.</p>
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
