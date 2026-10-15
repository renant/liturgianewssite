import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = { title: "Página não encontrada", robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };

export default function NotFound() {
  return <StatusPage icon={<BookOpen className="size-10" />} eyebrow="Página não encontrada · 404" title="Vamos encontrar outra leitura?">
    <p>Esta página não existe ou não está mais disponível. Você pode abrir a liturgia de hoje ou escolher uma data no calendário.</p><p>Se acredita que há algum erro, <Link href="/contact" className="text-link">entre em contato</Link>.</p>
  </StatusPage>;
}
