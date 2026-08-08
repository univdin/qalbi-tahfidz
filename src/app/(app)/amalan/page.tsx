import type { Metadata } from "next";
import Link from "next/link";
import { AMALAN } from "@/lib/amalan";

export const metadata: Metadata = {
  title: "Amalan Rutin — QalbiTahfidz",
  description:
    "Bacaan amalan rutin: Yasin & Tahlil, Al-Kahfi (Jumat), Al-Waqi'ah, dan Al-Mulk lengkap dengan terjemahan dan audio.",
  robots: { index: true, follow: true },
};

export default function AmalanIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Amalan Rutin
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bacaan amalan harian &amp; pekanan dalam satu aliran, dengan
          terjemahan dan audio per ayat.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {AMALAN.map((a) => (
          <Link
            key={a.slug}
            href={`/amalan/${a.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <h2 className="font-bold text-slate-900 dark:text-slate-50">{a.title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
