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
        <p>
          <em>Lectio divina</em> (expressão latina que significa <strong>&ldquo;Leitura Orante da Palavra de Deus&rdquo;</strong>) é uma prática milenar da tradição cristã para se aproximar da Sagrada Escritura em espírito de fé e escuta. Seu objetivo não é estudar o maior número possível de páginas nem fazer apenas uma análise histórica, mas acolher o texto bíblico como Palavra viva, responder a Deus em oração e deixar que o Evangelho ilumine e transforme a vida cotidiana.
        </p>

        <h2>A Origem da Leitura Orante na Tradição da Igreja</h2>
        <p>
          Praticada desde os Padres da Igreja (como Orígenes, Santo Ambrósio e Santo Agostinho) e cultivada profundamente na tradição monástica por São Bento, a <em>Lectio divina</em> foi sistematizada no século XII pelo monge cartuxo Guigo II em sua obra <em>A Escada dos Monges</em>. Ele descreveu quatro degraus espirituais que conduzem a alma da terra ao céu: <strong>leitura (lectio)</strong>, <strong>meditação (meditatio)</strong>, <strong>oração (oratio)</strong> e <strong>contemplação (contemplatio)</strong>.
        </p>
        <p>
          No Concílio Vaticano II (<em>Dei Verbum</em>, n. 25) e no magistério recente dos Papas, a Igreja recomenda vivamente que todos os fiéis leigos, famílias e comunidades redescubram a <em>Lectio divina</em> a partir das leituras da{" "}
          <Link href="/liturgia/hoje">liturgia de hoje</Link>.
        </p>

        <h2>Os 4 Passos da Lectio Divina</h2>

        <h3>1. Leitura (Lectio): O que o texto diz em si mesmo?</h3>
        <p>
          Após invocar o Espírito Santo em silêncio, leia o trecho bíblico devagar, duas ou três vezes. Observe com atenção os detalhes da cena: quem está falando, a quem se dirige, quais verbos e ações aparecem, qual é o cenário e quais palavras se repetem. A primeira etapa pede escuta respeitosa e atenta, sem apressar conclusões.
        </p>

        <h3>2. Meditação (Meditatio): O que o texto diz para mim hoje?</h3>
        <p>
          Na meditação, ruminamos interiormente a Palavra para descobrir o que Deus deseja falar à nossa vida presente. Pergunte-se com sinceridade: onde este texto encontra a minha experiência atual? Que atitude de Cristo me interpela, consola ou chama à conversão? A{" "}
          <Link href="/liturgia/hoje">liturgia de hoje</Link> e sua reflexão oferecem um ponto de partida diário seguro para esse exercício.
        </p>

        <h3>3. Oração (Oratio): O que o texto me leva a dizer a Deus?</h3>
        <p>
          Se na leitura e na meditação Deus falou ao nosso coração, na oração nós respondemos a Ele. Converse com o Senhor com palavras simples e filiais a partir do texto meditado: agradeça por uma graça compreendida, peça perdão por uma resistência, suplique força para vencer uma provação ou interceda pelas pessoas que vieram à sua memória durante a leitura.
        </p>

        <h3>4. Contemplação (Contemplatio): Permanecer na presença do Senhor</h3>
        <p>
          Depois de falar com Deus, permaneça alguns instantes em silêncio amoroso diante d&apos;Ele, acolhendo a paz e a luz que o Espírito Santo infunde na alma. Não é necessário produzir pensamentos complexos ou uma sensação extraordinária; basta ficar disponível e repousar sob o olhar paterno de Deus, vendo a realidade com o olhar de Cristo.
        </p>

        <h2>Da Contemplação à Vida (Actio): Levar a Palavra para o dia</h2>
        <p>
          A tradição espiritual acrescenta um fruto indispensável aos quatro degraus: a <strong>ação (actio)</strong>. A verdadeira escuta da Palavra gera conversão e caridade fraterna (cf. Tg 1,22). Conclua seu momento de <em>Lectio divina</em> escolhendo uma atitude concreta e possível, coerente com o que leu — um gesto de paciência em casa, uma reconciliação, uma ajuda a quem precisa ou a retidão no trabalho.
        </p>

        <h2>Exemplo Prático: Aplicando os 4 Degraus no Evangelho</h2>
        <p>
          Para visualizar como a <em>Lectio divina</em> funciona na prática sem complicações, imagine que o Evangelho do dia proclame o encontro de Jesus com o cego de Jericó (Lc 18,35-43):
        </p>
        <ul>
          <li>
            <strong>Na Leitura (Lectio):</strong> Você lê o texto devagar e repara nos personagens: o mendigo sentado à beira do caminho, a multidão que tenta calá-lo, Jesus que para, manda chamá-lo e pergunta: <em>&ldquo;O que queres que eu faça por ti?&rdquo;</em>.
          </li>
          <li>
            <strong>Na Meditação (Meditatio):</strong> Você traz essa pergunta de Cristo para o seu próprio coração: hoje, diante das minhas preocupações e cegueiras interiores, o que eu realmente preciso pedir a Jesus para enxergar com fé?
          </li>
          <li>
            <strong>Na Oração (Oratio):</strong> Você faz sua a súplica humilde do cego — <em>&ldquo;Senhor, que eu veja!&rdquo;</em> —, entregando a Deus uma decisão difícil ou pedindo luz para compreender uma pessoa próxima.
          </li>
          <li>
            <strong>Na Contemplação e Ação (Contemplatio &amp; Actio):</strong> Você permanece um minuto em silêncio agradecendo a proximidade de Cristo e decide caminhar naquele dia louvando a Deus através da paciência e da atenção a quem precisa de ajuda.
          </li>
        </ul>

        <h2>Conselhos da Tradição Espiritual para Perseverar</h2>
        <p>
          Na Exortação Apostólica Pós-Sinodal <em>Verbum Domini</em> (nn. 86-87), o Papa Bento XVI recordou que a <em>Lectio divina</em> é capaz de abrir ao fiel o tesouro da Palavra de Deus e também de criar o encontro com Cristo, Palavra divina viva. Para que esse hábito floresça em sua rotina:
        </p>
        <ul>
          <li>
            <strong>Invoque sempre o Espírito Santo antes de ler:</strong> A Sagrada Escritura deve ser lida e interpretada com a ajuda do mesmo Espírito mediante o qual foi escrita (<em>Dei Verbum</em>, n. 12).
          </li>
          <li>
            <strong>Leia em comunhão com a liturgia da Igreja:</strong> Seguir as leituras propostas pelo <Link href="/liturgia">calendário litúrgico</Link> evita que leiamos apenas os textos que já conhecemos ou que agradam ao nosso gosto imediato, abrindo-nos à totalidade da Revelação.
          </li>
          <li>
            <strong>Anote uma palavra-chave num caderno espiritual:</strong> Escrever em uma linha a frase bíblica que tocou seu coração ajuda a fixá-la na memória e permite perceber, ao longo das semanas, como Deus vem conduzindo sua história.
          </li>
        </ul>
        <p>
          Se a regularidade diária ajudar em sua caminhada, você pode{" "}
          <Link href="#newsletter">receber a liturgia diária por e-mail</Link> e reservar esse encontro para o começo de cada manhã, consultando também o guia de{" "}
          <Link href="/acompanhar">como acompanhar a liturgia diária</Link> e nossos artigos formativos no{" "}
          <Link href="/blog">blog da LiturgiaNews</Link>.
        </p>
        <hr />
        <p className="text-xs text-slate-600">
          <em>Referências documentais: Constituição Dogmática Dei Verbum (nn. 12, 21, 25), Exortação Apostólica Verbum Domini (nn. 86-87), Catecismo da Igreja Católica (nn. 1177, 2700-2719).</em>
        </p>
      </article>
      <NewsletterPanel source="lectio_divina" />
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
