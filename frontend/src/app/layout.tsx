import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Manuel Pérez López",
    template: "Manuel Pérez López | %s",
  },
  description:
    "Técnico en sistemas informáticos. Portfolio, CV y artículos sobre informática, redes y proyectos.",
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Manuel Pérez López",
      url: siteUrl,
      inLanguage: "es",
    },
    {
      "@type": "Person",
      name: "Manuel Pérez López",
      url: siteUrl,
      sameAs: ["https://www.linkedin.com/in/manuel-perez-lopez/"],
      jobTitle: "Técnico en sistemas informáticos",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
