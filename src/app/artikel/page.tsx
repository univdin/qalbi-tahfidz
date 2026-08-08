import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";

export const metadata: Metadata = {
  title: "Artikel & Amalan — QalbiTahfidz",
  description:
    "Artikel keutamaan amalan, ayat pilihan, dan edukasi Al-Qur'an (Ayat Kursi, Seribu Dinar, Nuzulul Qur'an, Al-Mulk, Al-Waqi'ah).",
  robots: { index: true, follow: true },
};

export default function ArtikelIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Artikel &amp; Amalan
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keutamaan amalan, ayat pilihan, dan edukasi Al-Qur&apos;an.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/artikel/${a.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              {a.category}
            </span>
            <h2 className="mt-1 font-bold text-slate-900 dark:text-slate-50">
              {a.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {a.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
