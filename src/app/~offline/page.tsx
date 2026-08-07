import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline — QalbiTahfidz",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 bg-zinc-50 dark:bg-zinc-950 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl font-bold text-white">
        ق
      </span>
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Kamu sedang offline
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Surah yang sudah pernah dibuka akan tetap bisa dibaca. Sambungkan kembali
          internet untuk memuat hafalan baru.
        </p>
      </div>
      <Link
        href="/"
        className="flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
