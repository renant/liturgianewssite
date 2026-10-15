import Link from "next/link";

const links = [
  { href: "/sobre", label: "Sobre" },
  { href: "/contact", label: "Contato" },
  { href: "/donate", label: "Apoiar" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/acompanhar", label: "Como acompanhar" },
  { href: "/lectio-divina", label: "Lectio divina" },
  { href: "/tempo-liturgico", label: "Tempo litúrgico" },
];

export function Footer() {
  return <footer className="site-footer">
    <div className="site-container footer-content">
      <div><Link href="/" className="font-serif text-lg font-semibold text-amber-900">LiturgiaNews</Link><p className="mt-2 text-sm text-slate-600">Liturgia católica diária, com você.</p></div>
      <nav aria-label="Links do rodapé" className="footer-nav">{links.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <p className="footer-note">Para cancelar a newsletter, use o link no rodapé de qualquer e-mail recebido.</p>
    </div>
  </footer>;
}
