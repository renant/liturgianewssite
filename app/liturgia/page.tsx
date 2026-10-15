import type { Metadata } from "next";
import { LiturgyCalendar } from "@/components/liturgy/calendar";
import { getContentIndex } from "@/lib/content-metadata";
import { getLiturgicalDate } from "@/lib/liturgical-date";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Calendário litúrgico — Liturgia Católica Diária",
  description: "Consulte a liturgia de hoje e as leituras de cada dia no calendário. Navegue entre meses e encontre liturgias passadas e futuras disponíveis.",
  alternates: { canonical: "https://www.liturgianews.site/liturgia" },
  openGraph: { title: "Calendário litúrgico | LiturgiaNews", description: "Escolha uma data para ler a liturgia católica diária.", url: "https://www.liturgianews.site/liturgia", type: "website" },
};

export default function Page() {
  const today = getLiturgicalDate();
  return <LiturgyCalendar year={today.year} month={today.month} today={today.iso} entries={getContentIndex("liturgia-content")} isIndex />;
}
