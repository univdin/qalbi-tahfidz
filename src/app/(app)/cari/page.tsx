import type { Metadata } from "next";
import { Omnibox } from "@/components/quran/Omnibox";
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
          Cari Ayat &amp; Navigasi Cepat
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ketik perintah navigasi (&quot;juz 30&quot;, &quot;halaman 150&quot;,
          &quot;al baqarah 286&quot;) atau kata kunci pencarian.
        </p>
      </div>
      <Omnibox />
      <SearchBox />
    </div>
  );
}
