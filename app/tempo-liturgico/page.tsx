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
        <p>
          O <strong>ano litúrgico</strong> organiza a celebração cristã ao redor de todo o mistério da vida, morte, ressurreição e glorificação de Jesus Cristo. Seu ritmo não coincide simplesmente com o calendário civil de janeiro a dezembro: ele começa no Primeiro Domingo do Advento (entre o final de novembro e o início de dezembro) e encerra-se na Solenidade de Nosso Senhor Jesus Cristo, Rei do Universo, atravessando tempos sagrados com ênfases espirituais próprias.
        </p>

        <h2>Um caminho de fé ao longo do ano</h2>
        <p>
          Ao distribuir a memória dos mistérios da Redenção ao longo das semanas do ano, a Igreja não apenas recorda fatos históricos, mas abre aos fiéis a riqueza da graça salvadora de Cristo em cada etapa da existência:
        </p>
        <ul>
          <li>
            <strong>Tempo do Advento:</strong> Quatro semanas de vigilância alegre e preparação espiritual com dupla dimensão: preparar a celebração do Natal do Senhor e renovar a esperança na segunda vinda gloriosa de Cristo.
          </li>
          <li>
            <strong>Tempo do Natal:</strong> Inicia-se nas Primeiras Vésperas do Natal (24 de dezembro à noite) e estende-se até a Festa do Batismo do Senhor, contemplando a Encarnação do Verbo, a Sagrada Família, Santa Maria Mãe de Deus e a Epifania do Senhor a todos os povos.
          </li>
          <li>
            <strong>Tempo da Quaresma:</strong> Quarenta dias que vão da Quarta-Feira de Cinzas até a Quinta-Feira Santa (antes da Missa da Ceia do Senhor), dedicados à conversão do coração por meio da oração, do jejum e da esmola.
          </li>
          <li>
            <strong>Sagrado Tríduo Pascal:</strong> O coração e ápice de todo o ano litúrgico, celebrando a Paixão, Morte, Sepultura e Ressurreição de Cristo desde a noite da Quinta-Feira Santa até o Domingo da Páscoa.
          </li>
          <li>
            <strong>Tempo Pascal:</strong> Cinquenta dias celebrados como um único grande domingo de alegria, da Páscoa da Ressurreição até a Solenidade de Pentecostes, com a efusão do Espírito Santo sobre a Igreja.
          </li>
          <li>
            <strong>Tempo Comum:</strong> Composto por 33 ou 34 semanas divididas em duas partes (após o Batismo do Senhor até a terça-feira antes das Cinzas, e após Pentecostes até o Advento). Percorre a vida pública, o ministério e os ensinamentos de Jesus, ajudando a fé a amadurecer na fidelidade cotidiana.
          </li>
        </ul>

        <h2>Graus das celebrações: Solenidades, Festas e Memórias</h2>
        <p>
          Enquanto caminha pelos tempos litúrgicos, a Igreja celebra também a Virgem Maria, os Apóstolos, os Mártires e os Santos, organizados segundo a importância litúrgica de cada dia:
        </p>
        <ul>
          <li>
            <strong>Solenidades:</strong> São os dias de grau mais elevado, dedicados aos maiores mistérios da fé, à Virgem Maria e a santos de relevância universal (como São José, São João Batista, São Pedro e São Paulo, Todos os Santos). Contam com três leituras bíblicas, oração do <em>Glória</em> e <em>Credo</em>.
          </li>
          <li>
            <strong>Festas:</strong> Celebram mistérios do Senhor, títulos marianos ou os Apóstolos e Evangelistas dentro dos limites do dia natural, incluindo o hino do <em>Glória</em>.
          </li>
          <li>
            <strong>Memórias (Obrigatórias ou Facultativas):</strong> Recordam o testemunho dos santos na vida cotidiana da Igreja, normalmente mantendo as leituras feriais do dia para preservar a leitura contínua da Palavra de Deus.
          </li>
        </ul>

        <h2>Por que as leituras mudam a cada dia e a cada ano?</h2>
        <p>
          As leituras bíblicas são distribuídas pela Igreja no Lecionário em um ciclo de três anos para os domingos (<strong>Anos A, B e C</strong>, dedicados respectivamente aos Evangelhos de Mateus, Marcos e Lucas) e um ciclo de dois anos para a primeira leitura dos dias de semana (<strong>Anos Pares e Ímpares</strong>). Assim, a comunidade escuta diferentes partes da Escritura e acompanha cada etapa do calendário com profundidade. No{" "}
          <Link href="/liturgia">calendário litúrgico</Link>, é possível percorrer essas datas e observar sua continuidade.
        </p>

        <h2>Acompanhe o dia presente</h2>
        <p>
          A maneira mais concreta de perceber esse ritmo espiritual é acompanhar diariamente a{" "}
          <Link href="/liturgia/hoje">liturgia de hoje</Link> e consultar os nossos artigos de formação no{" "}
          <Link href="/blog">blog da LiturgiaNews</Link>. Se desejar criar o hábito de oração matinal,{" "}
          <Link href="#newsletter">assine a newsletter gratuita</Link> para receber a leitura de cada manhã diretamente em seu e-mail.
        </p>
      </article>
      <NewsletterPanel source="tempo_liturgico" />
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
