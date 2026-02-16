import Link from "next/link";

const navLinkClassName =
    "text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm";

const navItems = [
    { href: "/liturgia/hoje", label: "Liturgia de hoje" },
    { href: "/sobre", label: "Sobre" },
    { href: "/privacidade", label: "Privacidade" },
    { href: "/contact", label: "Contato" },
    { href: "/donate", label: "Apoiar" },
];

export function Header() {
    return (
        <header className="w-full border-b border-amber-100/70 bg-white/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
                <Link
                    href="/"
                    className="text-lg font-serif font-semibold text-amber-900 tracking-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
                    aria-label="LiturgiaNews - Página inicial"
                >
                    LiturgiaNews
                </Link>
                <nav
                    aria-label="Navegação principal"
                    className="flex flex-wrap items-center justify-center gap-4 md:justify-end"
                >
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className={navLinkClassName}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
