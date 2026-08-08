import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl font-bold text-white">
        ق
      </span>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Surah atau halaman yang kamu tuju tidak tersedia.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/reader"
          className="flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Daftar Surah
        </Link>
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
