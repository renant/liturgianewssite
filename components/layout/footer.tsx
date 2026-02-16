import Link from "next/link";

const navLinkClassName =
    "text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm";

const footerLinks = [
    { href: "/sobre", label: "Sobre" },
    { href: "/privacidade", label: "Privacidade" },
    { href: "/contact", label: "Fale conosco" },
    { href: "/donate", label: "Apoiar" },
];

export function Footer() {
    return (
        <footer className="w-full border-t border-amber-100/70 bg-white/80">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        LiturgiaNews - Liturgia catolica diaria por e-mail.
                    </p>
                    <nav
                        aria-label="Links do rodape"
                        className="flex flex-wrap items-center gap-4"
                    >
                        {footerLinks.map((item) => (
                            <Link key={item.href} href={item.href} className={navLinkClassName}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                    Para cancelar a newsletter, utilize o link no rodape de qualquer e-mail
                    recebido.
                </p>
            </div>
        </footer>
    );
}
