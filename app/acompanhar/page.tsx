import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Como acompanhar a liturgia diária", description: "Um caminho simples para ler as leituras do dia com atenção, oração e constância.", alternates: { canonical: "https://www.liturgianews.site/acompanhar" } };

export default function Page() { return <article className="prose prose-slate mx-auto max-w-2xl">
  <h1>Como acompanhar a liturgia diária</h1>
  <p>A liturgia diária aproxima a vida comum das leituras celebradas pela Igreja. Não é preciso transformar esse encontro em uma tarefa longa: constância e atenção costumam ser mais úteis do que pressa para terminar.</p>
  <h2>Prepare um momento possível</h2>
  <p>Escolha um horário que caiba de verdade na rotina e reduza as distrações por alguns minutos. Comece observando a data e o tempo litúrgico, depois leia os textos na ordem em que aparecem. Você pode abrir agora a <Link href="/liturgia/hoje">liturgia de hoje</Link>.</p>
  <h2>Leia, escute e guarde uma frase</h2>
  <p>Faça uma primeira leitura para compreender o texto. Na segunda, perceba uma palavra, uma imagem ou um convite que se destaca. Guardar uma única frase ao longo do dia ajuda a leitura a chegar às decisões concretas.</p>
  <h2>Crie continuidade</h2>
  <p>Retomar as leituras todos os dias permite reconhecer temas e movimentos que uma leitura isolada não mostra. Para receber esse lembrete pela manhã, <Link href="/">assine gratuitamente a newsletter</Link>.</p>
  </article>; }
