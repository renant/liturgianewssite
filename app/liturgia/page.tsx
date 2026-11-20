import type { Metadata } from "next";
import { LiturgyCalendar } from "@/components/liturgy/calendar";
import { getContentIndex } from "@/lib/content-metadata";
import { getLiturgicalDate } from "@/lib/liturgical-date";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = buildPageMetadata({
  title: "Calendário litúrgico de hoje",
  description: "Veja o calendário litúrgico de hoje, abra a liturgia do dia e navegue pelas leituras de outros dias. O destaque indica a celebração e o tempo litúrgico atuais.",
  path: "/liturgia",
});

export default function Page() {
  const today = getLiturgicalDate();
  return <LiturgyCalendar year={today.year} month={today.month} today={today.iso} entries={getContentIndex("liturgia-content")} isIndex />;
}
