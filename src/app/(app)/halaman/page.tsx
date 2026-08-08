import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Baca Al-Qur'an per Halaman (Mushaf) — QalbiTahfidz",
  description:
    "Baca Al-Qur'an per halaman mushaf (1–604) dengan terjemahan Indonesia dan audio per ayat.",
  robots: { index: true, follow: true },
};

export default function HalamanIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Baca per Halaman Mushaf
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pilih halaman 1–604 sesuai mushaf standar (15 baris/halaman).
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: 604 }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/halaman/${p}`}
            className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}
