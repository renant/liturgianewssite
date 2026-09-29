import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "O que é o tempo litúrgico", description: "Entenda como o ano litúrgico organiza a celebração da vida de Cristo e acompanha a comunidade cristã.", alternates: { canonical: "https://www.liturgianews.site/tempo-liturgico" } };

export default function Page() { return <article className="prose prose-slate mx-auto max-w-2xl">
  <h1>O que é o tempo litúrgico</h1>
  <p>O ano litúrgico organiza a celebração cristã ao redor da vida, morte e ressurreição de Jesus. Seu ritmo não coincide simplesmente com janeiro a dezembro: ele começa no Advento e atravessa tempos com ênfases próprias.</p>
  <h2>Um caminho ao longo do ano</h2>
  <p>Advento e Natal conduzem à celebração da vinda de Cristo. Quaresma, Semana Santa e Páscoa acompanham o mistério pascal. O Tempo Comum percorre a vida e o ensinamento de Jesus, ajudando a fé a amadurecer no cotidiano.</p>
  <h2>Por que as leituras mudam</h2>
  <p>As leituras são distribuídas para que a comunidade escute diferentes partes da Escritura e acompanhe cada etapa do calendário. No <Link href="/liturgia">arquivo de liturgias</Link>, é possível percorrer essas datas e observar sua continuidade.</p>
  <h2>Acompanhe o dia presente</h2>
  <p>A maneira mais concreta de perceber esse ritmo é acompanhar a <Link href="/liturgia/hoje">liturgia de hoje</Link>. Se desejar criar o hábito, <Link href="/">assine a newsletter gratuita</Link> para receber a leitura de cada manhã.</p>
  </article>; }
