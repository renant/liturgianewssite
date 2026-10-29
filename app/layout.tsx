import JsonLd from "@/components/jsonld/JsonLd";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    telephone: false,
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: `${SITE_URL}/feed.xml`, title: "Blog - LiturgiaNews" },
        { url: `${SITE_URL}/liturgia/feed.xml`, title: "Liturgia Diária - LiturgiaNews" },
      ],
    },
  },
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
    url: SITE_URL,
    siteName: "LiturgiaNews",
    images: [DEFAULT_OG_IMAGE],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@liturgianews",
    creator: "@liturgianews",
    title: "LiturgiaNews - Liturgia Católica Diária por E-mail",
    description:
      "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  // Quando houver um código real do Search Console (método tag HTML), adicione-o em verification.google.
  category: "religion",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fffbeb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased`}>
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
            url: SITE_URL,
            description:
              "Receba a liturgia católica diária em seu e-mail todas as manhãs. Newsletter gratuita com leituras, salmos e reflexões.",
            inLanguage: "pt-BR",
            publisher: {
              "@type": "Organization",
              name: "LiturgiaNews",
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/images/android-chrome-192x192.png`,
                width: 192,
                height: 192,
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Portuguese",
                url: `${SITE_URL}/contact`,
              },
            },
          }}
        />
        {Boolean(process.env.VERCEL) && <Analytics />}
      </body>
    </html>
  );
}
