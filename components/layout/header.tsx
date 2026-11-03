"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { captureEvent } from "@/lib/analytics";
import { hasLocalNewsletterAnchor } from "@/lib/newsletter";

const links = [
  { href: "/liturgia/hoje", label: "Hoje" },
  { href: "/liturgia", label: "Calendário" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname() || "/";
  const newsletterHref = hasLocalNewsletterAnchor(pathname) ? "#newsletter" : "/#newsletter";
  return (
    <header className="site-header">
      <div className="site-container header-content">
        <Link href="/" className="site-brand">
          LiturgiaNews<span>Palavra para cada dia</span>
        </Link>
        <Link
          href={newsletterHref}
          className="header-subscribe"
          onClick={() =>
            captureEvent("newsletter_cta_click", {
              from: pathname,
              placement: "header",
            })
          }
        >
          Receber por e-mail
        </Link>
        <nav aria-label="Navegação principal" className="header-nav">
          {links.map(({ href, label }) => {
            const active =
              href === "/liturgia"
                ? pathname.startsWith(href) && pathname !== "/liturgia/hoje"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
