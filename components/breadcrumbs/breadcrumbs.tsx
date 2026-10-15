import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/jsonld/JsonLd";

export interface BreadcrumbItem { label: string; href: string }

export function Breadcrumbs({ items, className = "" }: { items: BreadcrumbItem[]; className?: string }) {
  const allItems = [{ label: "Início", href: "/" }, ...items];
  return <>
    <nav aria-label="Você está em" className={`breadcrumbs ${className}`}><ol>
      {allItems.map((item, index) => <li key={item.href}>
        {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />}
        {index === allItems.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{index === 0 ? <><Home className="size-4" aria-hidden="true" /><span className="sr-only">Início</span></> : item.label}</Link>}
      </li>)}
    </ol></nav>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: allItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: `https://www.liturgianews.site${item.href === "/" ? "" : item.href}` })) }} />
  </>;
}
