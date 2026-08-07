import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const fiturUtama = [
  {
    ikon: "🔊",
    judul: "Murottal Per Ayat",
    deskripsi:
      "Audio loop per ayat dengan jeda hening otomatis ala Metode Ummi (Nada Nahawand) untuk latihan menirukan mandiri.",
  },
  {
    ikon: "📖",
    judul: "Mushaf Dwi-Skrip",
    deskripsi:
      "Teks Uthmani & IndoPak standar Kemenag RI lengkap dengan terjemahan Indonesia, tanpa perlu unduh aplikasi.",
  },
  {
    ikon: "🧠",
    judul: "Penjadwalan FSRS",
    deskripsi:
      "Ulangan Sabaq, Sabqi & Manzil dijadwalkan otomatis berdasarkan stabilitas memori (spaced repetition).",
  },
  {
    ikon: "🎙️",
    judul: "Verifikasi Bacaan AI",
    deskripsi:
      "Rekam bacaan lalu dapatkan skor & umpan balik per ayat lewat AI speech (Cloudflare Workers AI + WebGPU offline).",
  },
  {
    ikon: "📊",
    judul: "Dashboard Pantauan",
    deskripsi:
      "Orang tua & guru melihat progres hafalan anak secara real-time: kartu SRS, streak, dan ringkasan prestasi.",
  },
  {
    ikon: "📴",
    judul: "PWA Offline",
    deskripsi:
      "Surah yang sudah dibuka tetap bisa dibaca tanpa koneksi internet — install dari browser dalam sekali klik.",
  },
];

const caraKerja = [
  {
    langkah: "1",
    judul: "Dengarkan & Tirukan",
    deskripsi:
      "Putar murottal per ayat, ikuti dengan jeda hening otomatis sesuai kecepatan anak.",
  },
  {
    langkah: "2",
    judul: "Ulangi (Tikrar)",
    deskripsi:
      "Atur pengulangan berjenjang N× per ayat dan per blok untuk memperkuat hafalan.",
  },
  {
    langkah: "3",
    judul: "Jadwal Ulangan Otomatis",
    deskripsi:
      "FSRS menentukan kapan tiap ayat perlu diulang agar hafalan benar-benar melekat.",
  },
];

const untukSiapa = [
  {
    judul: "Orang Tua",
    deskripsi:
      "Dampingi anak menghafal di rumah dan pantau progresnya lewat dashboard, tanpa perlu ke lembaga tertentu.",
  },
  {
    judul: "Guru & Coach Tahfidz",
    deskripsi:
      "Kelola hafalan santri per kelas: Sabaq, Sabqi, Manzil terjadwal otomatis dan ringkasan per anak.",
  },
  {
    judul: "Anak & Remaja",
    deskripsi:
      "Belajar mandiri dengan audio, tikrar, dan verifikasi bacaan yang ramah anak.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              ق
            </span>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              QalbiTahfidz
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
            <a href="#fitur" className="transition-colors hover:text-emerald-600">
              Fitur
            </a>
            <a href="#cara-kerja" className="transition-colors hover:text-emerald-600">
              Cara Kerja
            </a>
            <a href="#untuk-siapa" className="transition-colors hover:text-emerald-600">
              Untuk Siapa
            </a>
            <Link
              href="https://github.com/univdin/qalbi-tahfidz"
              className="transition-colors hover:text-emerald-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Repositori
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full bg-emerald-600 px-4 py-1.5 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Masuk
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="flex flex-col items-start gap-6 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Web App · PWA · Gratis · Open Source
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Platform hafalan Al-Qur&apos;an untuk anak & keluarga
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Web app yang menggabungkan murottal per ayat (Metode Ummi / Nada
            Nahawand), pengulangan Tikrar, dan penjadwalan ulangan FSRS. Baca
            langsung tanpa daftar — buat akun hanya bila ingin menyimpan progres
            hafalan.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reader"
              className="flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Buka Murottal — Gratis
            </Link>
            <Link
              href="/auth/signup"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Buat Akun untuk Menyimpan Progres
            </Link>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tidak perlu kartu kredit · Berjalan di browser HP & desktop
          </p>
        </section>

        <section id="fitur" className="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {fiturUtama.map((f) => (
            <div
              key={f.judul}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-2xl" aria-hidden>
                {f.ikon}
              </span>
              <h2 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {f.judul}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {f.deskripsi}
              </p>
            </div>
          ))}
        </section>

        <section id="cara-kerja" className="py-10">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Cara Kerja Platform
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {caraKerja.map((c) => (
                <div key={c.langkah}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                    {c.langkah}
                  </span>
                  <h3 className="mt-2 text-lg font-bold">{c.judul}</h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-50">
                    {c.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="untuk-siapa" className="py-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Dibuat untuk Siapa
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {untukSiapa.map((u) => (
              <div
                key={u.judul}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                  {u.judul}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {u.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            QalbiTahfidz — صدقة جارية · platform web sumber terbuka yang dibangun
            di atas Quran.com, @quranjs/api, ts-fsrs & adhan-js.
          </p>
          <Link href="https://github.com/univdin/qalbi-tahfidz" className="hover:text-emerald-600">
            github.com/univdin/qalbi-tahfidz
          </Link>
        </div>
      </footer>
    </div>
  );
}
