import { GoogleTagManager } from "@next/third-parties/google";
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
  title: "LiturgiaNews",
  description:
    "Receba a liturgia católica diária em seu e-mail todas as manhãs.",
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
  ],
  openGraph: {
    title: "LiturgiaNews",
    description:
      "Receba a liturgia católica diária em seu e-mail todas as manhãs.",
    images: [
      {
        url: "https://www.liturgianews.site/images/android-chrome-192x192.png",
        width: 1200,
        height: 630,
        alt: "LiturgiaNews",
      },
    ],
    locale: "pt_BR",
    type: "website",
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
          {children}
        </div>
        <GoogleTagManager gtmId={process.env.GA_TRACKING_ID as string} />
      </body>
    </html>
  );
}
