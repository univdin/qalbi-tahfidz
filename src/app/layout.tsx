import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Amiri, Scheherazade_New } from "next/font/google";
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
  title: {
    default: "QalbiTahfidz — Hafalan Al-Qur'an untuk Keluarga",
    template: "%s | QalbiTahfidz",
  },
  description:
    "Aplikasi hafalan Al-Qur'an anak & keluarga: metode Ummi/Nahawand, pengulangan berjenjang (Tikrar), sistem ulangan berjarak FSRS, dan mushaf dwi-skrip (Uthmani/IndoPak).",
  applicationName: "QalbiTahfidz",
  keywords: [
    "tahfidz",
    "hafalan quran",
    "metode ummi",
    "juz amma",
    "spaced repetition",
    "quran anak",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QalbiTahfidz",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${scheherazade.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
