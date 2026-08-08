import type { Metadata } from "next";
import { SearchBox } from "@/components/quran/SearchBox";

export const metadata: Metadata = {
  title: "Cari Ayat — QalbiTahfidz",
  description:
    "Cari ayat Al-Qur'an dengan cepat dan akurat: pencarian teks Arab, lemma, dan akar kata dengan hasil persis dari dataset terverifikasi.",
  robots: { index: true, follow: true },
};

export default function CariPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Cari Ayat
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cari dengan teks Arab, transliterasi, kata kunci, atau akar kata.
          Hasil menautkan langsung ke pembaca surah.
        </p>
      </div>
      <SearchBox />
    </div>
  );
}
