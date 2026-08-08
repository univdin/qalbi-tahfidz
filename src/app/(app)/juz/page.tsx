import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Baca Al-Qur'an per Juz — QalbiTahfidz",
  description:
    "Baca Al-Qur'an per Juz (1–30) dengan terjemahan Indonesia dan audio per ayat.",
  robots: { index: true, follow: true },
};

export default function JuzIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Baca per Juz
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pilih Juz 1–30 untuk membaca bagian Al-Qur&apos;an secara utuh.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
          <Link
            key={j}
            href={`/juz/${j}`}
            className="flex h-20 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {j}
            </span>
            <span className="text-xs text-slate-500">Juz</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
