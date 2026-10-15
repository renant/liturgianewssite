import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StatusPage({ icon, eyebrow, title, children }: { icon: ReactNode; eyebrow: string; title: string; children: ReactNode }) {
  return <section className="status-page">
    <div className="status-icon" aria-hidden="true">{icon}</div>
    <p className="eyebrow">{eyebrow}</p><h1 className="page-title">{title}</h1>
    <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">{children}</div>
    <nav className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Continue navegando"><Link href="/liturgia/hoje" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-amber-700 px-4 py-3 text-sm font-medium text-white hover:bg-amber-800">Ler a liturgia de hoje<ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="/liturgia" className="text-link inline-flex min-h-11 items-center text-sm">Calendário litúrgico</Link></nav>
  </section>;
}
