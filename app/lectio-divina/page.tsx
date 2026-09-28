import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Lectio divina: o que é e como fazer", description: "Conheça um roteiro prático de leitura, meditação, oração e contemplação da Palavra.", alternates: { canonical: "https://www.liturgianews.site/lectio-divina" } };

export default function Page() { return <article className="prose prose-slate mx-auto max-w-2xl">
  <h1>Lectio divina: o que é e como fazer</h1>
  <p>Lectio divina é uma forma orante de se aproximar da Escritura. Seu objetivo não é estudar o maior número possível de páginas, mas acolher o texto, responder a ele em oração e deixar que ilumine a vida.</p>
  <h2>Leitura e meditação</h2>
  <p>Leia o trecho devagar, mais de uma vez. Observe quem fala, o que acontece e quais palavras se repetem. Depois pergunte o que esse texto revela e onde ele encontra sua experiência atual. A <Link href="/liturgia/hoje">liturgia de hoje</Link> oferece um ponto de partida diário.</p>
  <h2>Oração e contemplação</h2>
  <p>Responda com palavras simples: agradeça, peça ajuda ou apresente uma inquietação. Em seguida, permaneça alguns instantes em silêncio. Não é necessário produzir uma sensação especial; basta ficar disponível diante de Deus.</p>
  <h2>Levar a Palavra para o dia</h2>
  <p>Conclua escolhendo uma atitude possível, coerente com o que leu. Se a regularidade ajudar, você pode <Link href="/">receber a liturgia diária por e-mail</Link> e reservar esse encontro para o começo da manhã.</p>
  </article>; }
