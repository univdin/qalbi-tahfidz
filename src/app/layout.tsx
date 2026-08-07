import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Amiri, Scheherazade_New } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-quran-arabic",
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

const scheherazade = Scheherazade_New({
  variable: "--font-quran-indopak",
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Hafalan Al-Qur'an untuk Keluarga`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "tahfidz",
    "hafalan quran",
    "metode ummi",
    "nada nahawand",
    "juz amma",
    "spaced repetition",
    "fsrs",
    "tikrar",
    "quran anak",
    "hafalan alquran online",
  ],
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Hafalan Al-Qur'an untuk Keluarga`,
    description: SITE_DESCRIPTION,
    locale: "id_ID",
    images: [{ url: DEFAULT_OG_IMAGE, width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Hafalan Al-Qur'an untuk Keluarga`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "id",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon-192.png") },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/reader?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png") },
    sameAs: ["https://github.com/univdin/qalbi-tahfidz"],
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${scheherazade.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={jsonLdWebSite} />
        <JsonLd data={jsonLdOrganization} />
        {children}
      </body>
    </html>
  );
}
