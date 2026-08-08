import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Omnibox } from "@/components/quran/Omnibox";
import {
  Volume2,
  Baby,
  BookOpen,
  Brain,
  Mic,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FITUR_UTAMA = [
  {
    icon: Volume2,
    judul: "Murottal Per Ayat",
    deskripsi:
      "Audio per ayat berkualitas tinggi dengan jeda hening otomatis yang disesuaikan untuk latihan menirukan secara mandiri.",
  },
  {
    icon: Baby,
    judul: "Metode Ummi Anak (Juz 30)",
    deskripsi:
      "Modul khusus murottal anak dengan irama Metode Ummi/Nahawand (suara anak-anak) lengkap dengan pemutar A-B loop.",
    href: "/ummi",
  },
  {
    icon: BookOpen,
    judul: "Mushaf Dwi-Skrip",
    deskripsi:
      "Teks Uthmani & IndoPak standar Kemenag RI yang jernih dilengkapi terjemahan bahasa Indonesia resmi.",
    href: "/reader",
  },
  {
    icon: Brain,
    judul: "Penjadwalan Ulangan (Tikrar & FSRS)",
    deskripsi:
      "Pengulangan berjenjang Sabaq, Sabqi, dan Manzil yang dijadwalkan otomatis berdasarkan daya ingat anak.",
    href: "/deck",
  },
  {
    icon: Mic,
    judul: "Verifikasi Bacaan Suara",
    deskripsi:
      "Rekam suaramu lalu peroleh evaluasi ketepatan bacaan per ayat secara otomatis.",
    href: "/verify",
  },
  {
    icon: BarChart3,
    judul: "Pantauan Progres Orang Tua",
    deskripsi:
      "Pantau perkembangan hafalan, jumlah ulangan harian, dan pencapaian anak secara real-time di Dasbor.",
    href: "/dashboard",
  },
];

const CARA_KERJA = [
  {
    langkah: "1",
    judul: "Dengarkan & Menirukan",
    deskripsi:
      "Putar murottal per ayat. Anak mendengarkan bacaan tajwid yang benar lalu menirukannya pada jeda hening otomatis.",
  },
  {
    langkah: "2",
    judul: "Ulangi (Tikrar)",
    deskripsi:
      "Manfaatkan fitur pengulangan otomatis per ayat dan per blok surah untuk memperkuat kelekatan hafalan.",
  },
  {
    langkah: "3",
    judul: "Jadwal Ulangan Otomatis",
    deskripsi:
      "Sistem menentukan waktu terbaik untuk muroja'ah agar hafalan tetap kuat dan tidak gampang lupa.",
  },
];

const UNTUK_SIAPA = [
  {
    icon: HeartHandshake,
    judul: "Orang Tua di Rumah",
    deskripsi:
      "Mendampingi hafalan anak secara terstruktur di rumah tanpa perlu kebingungan menentukan jadwal muroja'ah harian.",
  },
  {
    icon: GraduationCap,
    judul: "Guru & Ustadz Tahfidz",
    deskripsi:
      "Mengelola kelompok hafalan santri dengan pencatatan Sabaq, Sabqi, dan Manzil yang rapi per anak.",
  },
  {
    icon: Users,
    judul: "Anak & Remaja Mandiri",
    deskripsi:
      "Menghafal mandiri dengan antarmuka yang ramah, ramah anak, dan bebas iklan yang mengganggu.",
  },
];

const FAQS = [
  {
    tanya: "Apakah platform ini gratis dan bebas iklan?",
    jawab:
      "Ya, QalbiTahfidz sepenuhnya bebas digunakan untuk membaca dan menghafal Al-Qur'an keluarga tanpa iklan yang mengganggu.",
  },
  {
    tanya: "Apa itu Metode Ummi & Nada Nahawand?",
    jawab:
      "Metode Ummi adalah metode pembelajaran Al-Qur'an yang populer dan ramah anak. Nada Nahawand memberikan lantunan murottal anak yang lembut, berirama, dan mudah ditirukan oleh anak-anak.",
  },
  {
    tanya: "Apakah data hafalan saya tersimpan secara aman?",
    jawab:
      "Progres hafalan tersimpan otomatis di perangkat Anda (offline-first) dan disinkronkan dengan aman jika Anda masuk ke akun.",
  },
  {
    tanya: "Bagaimana cara kerja pencarian cepat Al-Qur'an?",
    jawab:
      "Anda dapat mengetik nama surah (misal: 'Al-Ikhlas'), nomor juz ('juz 30'), nomor halaman ('halaman 10'), atau kata kunci langsung di kolom pencarian.",
  },
];

export default function Home() {
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.tanya,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.jawab,
      },
    })),
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <JsonLd data={jsonLdFaq} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-20 sm:pb-28">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center gap-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pendamping Tahfidz Keluarga di Rumah</span>
          </div>

          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Dampingi Anak Menghafal Al-Qur&apos;an Lebih Mudah &amp; Menyenangkan
          </h1>

          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Murottal per ayat dengan jeda menirukan mandiri, pengulangan Tikrar,
            dan modul khusus Metode Ummi (Nada Nahawand) anak.
          </p>

          {/* INSTANT SEARCH HERO */}
          <div className="w-full max-w-2xl mt-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-left text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Cari &amp; Langsung Mulai Murottal:
            </p>
            <Omnibox />
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row mt-2">
            <Link
              href="/reader"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95"
            >
              <BookOpen className="h-5 w-5" />
              <span>Mulai Baca Surah</span>
            </Link>
            <Link
              href="/ummi"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-7 font-bold text-amber-900 shadow-sm transition-all hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/60 active:scale-95"
            >
              <Baby className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span>Murottal Anak (Metode Ummi)</span>
            </Link>
          </div>

          {/* TRUST BADGES */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Teks Standar Kemenag RI
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Audio Murottal Resmi
            </span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-emerald-600" />
              Bebas Iklan &amp; Ramah Anak
            </span>
          </div>
        </section>

        {/* FITUR UTAMA */}
        <section id="fitur" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Fitur Lengkap untuk Hafalan Maksimal
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Dirancang khusus untuk kenyamanan membaca, menirukan, dan merawat hafalan.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FITUR_UTAMA.map((f) => {
              const Icon = f.icon;
              const cardContent = (
                <div className="flex flex-col gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {f.judul}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {f.deskripsi}
                  </p>
                </div>
              );

              const className =
                "block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700";

              return f.href ? (
                <Link key={f.judul} href={f.href} className={className}>
                  {cardContent}
                </Link>
              ) : (
                <div key={f.judul} className={className}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* CARA KERJA */}
        <section id="cara-kerja" className="py-12">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-900/90 p-8 text-white shadow-xl sm:p-12 dark:border-emerald-800 dark:bg-emerald-950">
            <h2 className="text-2xl font-bold sm:text-3xl text-center sm:text-left">
              Metode Hafalan Efektif
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {CARA_KERJA.map((c) => (
                <div
                  key={c.langkah}
                  className="flex flex-col gap-3 rounded-2xl bg-white/10 p-6 backdrop-blur"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 font-bold text-zinc-900">
                    {c.langkah}
                  </span>
                  <h3 className="text-lg font-bold text-white">{c.judul}</h3>
                  <p className="text-sm leading-relaxed text-emerald-100">
                    {c.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIBUAT UNTUK SIAPA */}
        <section id="untuk-siapa" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Pendamping Setiap Langkah Menghafal
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {UNTUK_SIAPA.map((u) => {
              const Icon = u.icon;
              return (
                <div
                  key={u.judul}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                    {u.judul}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {u.deskripsi}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-12 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <HelpCircle className="h-8 w-8 text-emerald-600" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Pertanyaan Sering Diajukan
            </h2>
          </div>
          <div className="grid gap-4 max-w-3xl mx-auto">
            {FAQS.map((faq) => (
              <div
                key={faq.tanya}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                  {faq.tanya}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.jawab}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MULTI-COLUMN FOOTER */}
      <footer className="w-full border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="grid gap-8 sm:grid-cols-4">
            {/* BRAND COLUMN */}
            <div className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white shadow-sm">
                  ق
                </span>
                <span className="text-zinc-900 dark:text-zinc-50">
                  Qalbi<span className="text-emerald-600">Tahfidz</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400 max-w-sm">
                Platform pendamping hafalan Al-Qur&apos;an keluarga: murottal per ayat,
                metode Ummi anak, penjadwalan ulangan, dan pantauan progres.
                Inisiatif Shadaqah Jariyah.
              </p>
            </div>

            {/* NAV COLUMN */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Navigasi
              </p>
              <Link href="/reader" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Murottal &amp; Quran
              </Link>
              <Link href="/ummi" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Metode Ummi (Juz 30)
              </Link>
              <Link href="/kisah" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Kisah Al-Qur&apos;an
              </Link>
              <Link href="/dashboard" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Dasbor &amp; Hafalan
              </Link>
            </div>

            {/* FEATURE COLUMN */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Fitur Unggulan
              </p>
              <Link href="/tafsir-ai" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Tanya Tafsir AI
              </Link>
              <Link href="/verify" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Verifikasi Suara
              </Link>
              <Link href="/amalan" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Amalan Harian
              </Link>
              <Link href="/akhlak" className="text-xs text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Nilai Akhlak
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:border-zinc-900">
            <p>© {new Date().getFullYear()} QalbiTahfidz. Berjalan di peramban seluler &amp; desktop.</p>
            <Link
              href="https://github.com/univdin/qalbi-tahfidz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-600"
            >
              <span>Kode Sumber GitHub</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
