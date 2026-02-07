import JsonLd from "@/components/jsonld/JsonLd";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Add font-display: swap for better performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Add font-display: swap for better performance
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.liturgianews.site"),
  title: {
    default: "LiturgiaNews - Liturgia Católica Diária por E-mail",
    template: "%s | LiturgiaNews",
  },
  description:
    "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs. Leituras, salmos, evangelho e reflexões para fortalecer sua fé.",
  alternates: {
    canonical: "https://www.liturgianews.site",
  },
  keywords: [
    "liturgia católica diária",
    "liturgia diária",
    "liturgia católica",
    "newsletter católica",
    "evangelho do dia",
    "leituras diárias",
    "missa diária",
    "orações católicas",
    "evangelho diário",
    "salmos diários",
    "reflexão diária católica",
    "liturgia no email",
  ],
  authors: [{ name: "LiturgiaNews" }],
  creator: "LiturgiaNews",
  publisher: "LiturgiaNews",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "LiturgiaNews - Liturgia Católica Diária por E-mail",
    description:
      "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs. Leituras, salmos e reflexões para fortalecer sua fé diariamente.",
    url: "https://www.liturgianews.site",
    siteName: "LiturgiaNews",
    images: [
      {
        url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
        width: 192,
        height: 192,
        alt: "LiturgiaNews Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@liturgianews",
    creator: "@liturgianews",
    title: "LiturgiaNews - Liturgia Católica Diária por E-mail",
    description:
      "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs.",
    images: {
      url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
      alt: "LiturgiaNews Logo",
    },
  },
  verification: {
    google: "verification-code", // Add your Google verification code when available
  },
  category: "religion",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinkClassName =
    "text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm";

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Manifest e ícones */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

        {/* RSS Feeds */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog - LiturgiaNews"
          href="https://www.liturgianews.site/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Liturgia Diária - LiturgiaNews"
          href="https://www.liturgianews.site/liturgia/feed.xml"
        />

        {/* Meta tags PWA */}
        <meta name="theme-color" content="#b45309" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LiturgiaNews" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-amber-800 focus:shadow"
        >
          Pular para o conteudo principal
        </a>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
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
                <Link href="/liturgia/hoje" className={navLinkClassName}>
                  Liturgia de hoje
                </Link>
                <Link href="/sobre" className={navLinkClassName}>
                  Sobre
                </Link>
                <Link href="/privacidade" className={navLinkClassName}>
                  Privacidade
                </Link>
                <Link href="/contact" className={navLinkClassName}>
                  Contato
                </Link>
                <Link href="/donate" className={navLinkClassName}>
                  Apoiar
                </Link>
              </nav>
            </div>
          </header>
          <main
            id="conteudo-principal"
            className="flex-1 w-full flex justify-center px-4 py-10"
          >
            <div className="w-full max-w-6xl">{children}</div>
          </main>
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
                  <Link href="/sobre" className={navLinkClassName}>
                    Sobre
                  </Link>
                  <Link href="/privacidade" className={navLinkClassName}>
                    Privacidade
                  </Link>
                  <Link href="/contact" className={navLinkClassName}>
                    Fale conosco
                  </Link>
                  <Link href="/donate" className={navLinkClassName}>
                    Apoiar
                  </Link>
                </nav>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Para cancelar a newsletter, utilize o link no rodape de qualquer
                e-mail recebido.
              </p>
            </div>
          </footer>
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "LiturgiaNews",
            alternateName: "Liturgia News",
            url: "https://www.liturgianews.site",
            description:
              "Receba a liturgia católica diária em seu e-mail todas as manhãs. Newsletter gratuita com leituras, salmos e reflexões.",
            inLanguage: "pt-BR",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://www.liturgianews.site/blog?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            publisher: {
              "@type": "Organization",
              name: "LiturgiaNews",
              url: "https://www.liturgianews.site",
              logo: {
                "@type": "ImageObject",
                url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
                width: 192,
                height: 192,
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Portuguese",
                url: "https://www.liturgianews.site/contact",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
