import Link from "next/link";

const fiturUtama = [
  {
    judul: "Dengarkan & Tirukan",
    deskripsi:
      "Audio loop per ayat dengan jeda hening otomatis (Metode Ummi / Nada Nahawand) untuk latihan mandiri.",
  },
  {
    judul: "Mushaf Dwi-Skrip",
    deskripsi:
      "Bacaan dwi-skrip Uthmani & IndoPak standar Kemenag RI dengan terjemahan dan tafsir.",
  },
  {
    judul: "Sistem Ulangan Berjarak (FSRS)",
    deskripsi:
      "Sabaq, Sabqi & Manzil dijadwalkan otomatis berdasarkan stabilitas hafalanmu.",
  },
  {
    judul: "Pemantauan Ortu & Guru",
    deskripsi:
      "Pantau progres hafalan anak secara real-time melalui dashboard analitik.",
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
            <a href="#metode" className="transition-colors hover:text-emerald-600">
              Metode
            </a>
            <a
              href="https://github.com/univdin/qalbi-tahfidz"
              className="transition-colors hover:text-emerald-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Repositori
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="flex flex-col items-start gap-6 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Hafalan Al-Qur&apos;an untuk Keluarga Indonesia
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Menghafal Al-Qur&apos;an jadi ringan, teratur, dan menyenangkan
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Aplikasi progresif (PWA) yang memadukan Metode Ummi (Nada Nahawand),
            pengulangan berjenjang Tikrar, dan sistem ulangan berjarak FSRS untuk
            anak usia 5–15 tahun serta keluarga.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#fitur"
              className="flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Mulai Menghafal
            </a>
            <a
              href="#metode"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Pelajari Metode
            </a>
          </div>
        </section>

        <section id="fitur" className="grid gap-4 py-10 sm:grid-cols-2">
          {fiturUtama.map((f) => (
            <div
              key={f.judul}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {f.judul}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {f.deskripsi}
              </p>
            </div>
          ))}
        </section>

        <section id="metode" className="py-10">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Metode Terpadu QalbiTahfidz
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <h3 className="text-lg font-bold">Ummi / Nahawand</h3>
                <p className="mt-1 text-sm leading-6 text-emerald-50">
                  Nada Tinggi–Datar–Rendah dengan jeda hening otomatis untuk
                  latihan menirukan.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold">Tikrar (N×M)</h3>
                <p className="mt-1 text-sm leading-6 text-emerald-50">
                  Pengulangan berjenjang: N kali per ayat, M kali per blok/halaman.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold">FSRS</h3>
                <p className="mt-1 text-sm leading-6 text-emerald-50">
                  Penjadwalan ulangan berdasarkan stabilitas memori Sabaq, Sabqi,
                  dan Manzil.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            QalbiTahfidz — صدقة جارية · dibangun di atas sumber terbuka Quran.com,
            @quranjs/api, ts-fsrs & adhan-js.
          </p>
          <Link href="https://github.com/univdin/qalbi-tahfidz" className="hover:text-emerald-600">
            github.com/univdin/qalbi-tahfidz
          </Link>
        </div>
      </footer>
    </div>
  );
}
