import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = { title: "Não foi possível concluir", robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };

export default function Page() {
  return <StatusPage icon={<AlertCircle className="size-10" />} eyebrow="Tente novamente" title="Não foi possível concluir sua solicitação">
    <p>Verifique sua conexão e tente novamente em alguns instantes. Para se inscrever, <Link href="/#newsletter" className="text-link">volte ao formulário da newsletter</Link>.</p><p>Se o problema continuar, <Link href="/contact" className="text-link">fale conosco</Link>.</p>
  </StatusPage>;
}
