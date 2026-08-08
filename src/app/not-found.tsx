import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — QalbiTahfidz",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 bg-zinc-50 dark:bg-zinc-950 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl font-bold text-white">
        ق
      </span>
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Halaman yang kamu tuju tidak ada atau sedang dipindahkan. Kembali ke
          beranda atau jelajahi daftar surah.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Ke Beranda
        </Link>
        <Link
          href="/reader"
          className="flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Daftar Surah
        </Link>
      </div>
    </div>
  );
}
