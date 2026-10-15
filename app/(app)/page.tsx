import JsonLd from "@/components/jsonld/JsonLd";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liturgia Católica Diária e Newsletter Gratuita",
  description: "Leia a liturgia de hoje, consulte as leituras de outras datas no calendário e receba gratuitamente a liturgia católica diária por e-mail.",
  alternates: { canonical: "https://www.liturgianews.site" },
};

export default function Home() {
  return <>
    <div className="grid items-center gap-10 py-4 md:grid-cols-[1.15fr_1fr] md:gap-14 md:py-10">
      <section aria-labelledby="home-title">
        <p className="eyebrow">Liturgia católica diária</p>
        <h1 id="home-title" className="max-w-xl font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">Um encontro com a Palavra, em cada dia.</h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">Leituras, salmos, Evangelho e reflexões para acompanhar seu momento de oração.</p>
        <nav className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5" aria-label="Acompanhe a liturgia">
          <Link href="/liturgia/hoje" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-amber-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-800"><BookOpen className="size-4" aria-hidden="true" />Ler a liturgia de hoje<ArrowRight className="size-4" aria-hidden="true" /></Link>
          <Link href="/liturgia" className="text-link inline-flex min-h-11 items-center gap-2 text-sm"><CalendarDays className="size-4" aria-hidden="true" />Calendário litúrgico</Link>
        </nav>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-600">Reserve alguns minutos para ler, meditar e levar a Palavra de Deus para o seu dia.</p>
      </section>
      <NewsletterPanel />
    </div>
    <section className="mt-10 border-t border-amber-200/70 pt-8 md:mt-14" aria-labelledby="start-title"><h2 id="start-title" className="font-serif text-2xl font-semibold text-slate-900">Para acompanhar com calma</h2><div className="mt-5 grid gap-6 sm:grid-cols-2"><Link className="group space-y-2" href="/acompanhar"><h3 className="font-serif text-xl font-semibold text-amber-800 group-hover:underline">Como acompanhar a liturgia diária</h3><p className="text-sm leading-relaxed text-slate-600">Um caminho simples para ler as leituras com atenção e constância.</p></Link><Link className="group space-y-2" href="/lectio-divina"><h3 className="font-serif text-xl font-semibold text-amber-800 group-hover:underline">Lectio divina: leitura e oração</h3><p className="text-sm leading-relaxed text-slate-600">Conheça a leitura, a meditação, a oração e a contemplação da Palavra.</p></Link></div></section>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: "Liturgia Católica Diária e Newsletter Gratuita", url: "https://www.liturgianews.site", description: "Leituras da liturgia católica diária e newsletter gratuita.", inLanguage: "pt-BR" }} />
  </>;
}
