import JsonLd from "@/components/jsonld/JsonLd";
import { PostHogProvider } from "@/components/posthog/PosthogProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.liturgianews.site"),
  title: "LiturgiaNews - Liturgia Católica Diária por E-mail",
  description:
    "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs.",
  alternates: {
    canonical: "https://www.liturgianews.site",
  },
  keywords: [
    "liturgia",
    "católica",
    "newsletter",
    "Liturgia Católica Diária",
    "Liturgia Diária",
    "Liturgia Diária Católica",
    "Liturgia no seu e-mail",
    "Liturgia Católica Diária no seu e-mail",
    "Liturgia Diária Católica no seu e-mail",
    "Liturgia diaria no seu e-mail",
    "leituras do dia",
    "evangelho diário",
  ],
  openGraph: {
    title: "LiturgiaNews - Liturgia Católica Diária por E-mail",
    description:
      "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs. Leituras, salmos e reflexões para fortalecer sua fé diariamente.",
    images: [
      {
        url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
        width: 1200,
        height: 630,
        alt: "LiturgiaNews - Liturgia Católica Diária",
      },
    ],
    locale: "pt_BR",
    type: "website",
    siteName: "LiturgiaNews",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiturgiaNews - Liturgia Católica Diária por E-mail",
    description:
      "Receba gratuitamente a liturgia católica diária em seu e-mail todas as manhãs.",
    images: ["https://www.liturgianews.site/images/android-chrome-192x192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
            {children}
          </div>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LiturgiaNews",
              url: "https://www.liturgianews.site",
              description:
                "Receba a liturgia católica diária em seu e-mail todas as manhãs.",
              inLanguage: "pt-BR",
              publisher: {
                "@type": "Organization",
                name: "LiturgiaNews",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
                },
              },
            }}
          />
        </PostHogProvider>
      </body>
    </html>
  );
}
