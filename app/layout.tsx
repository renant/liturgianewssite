import JsonLd from "@/components/jsonld/JsonLd";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
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
  // Quando houver um código real do Search Console (método tag HTML), adicione-o em verification.google.
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
  return (
    <html lang="pt-BR">
      <head>
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
        <meta name="theme-color" content="#fffbeb" />
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
          Pular para o conteúdo principal
        </a>
        <div className="site-shell">
          <Header />
          <main id="conteudo-principal" tabIndex={-1} className="site-main site-container">{children}</main>
          <Footer />
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
        <Analytics />
      </body>
    </html>
  );
}
