import type { Metadata } from "next";
import { MutashabihatExplorer } from "@/components/mutashabihat/MutashabihatExplorer";

export const metadata: Metadata = {
  title: "Mutashabihat — QalbiTahfidz",
  description:
    "Pengertian ayat mutashabihat dalam Ulumul Qur'an: ayat yang maknanya samar, ambigu, atau mengandung beberapa penafsiran — hakikatnya hanya Allah yang mengetahuinya, atau perlu dirujuk ke ayat muhkamat.",
  robots: { index: true, follow: true },
};

export default function MutashabihatPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Mutashabihat
        </h1>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
            <strong>Ayat mutashabihat</strong> adalah ayat-ayat Al-Qur&apos;an yang
            maknanya <strong>samar, ambigu, atau mengandung beberapa penafsiran</strong>,
            sehingga hakikat yang sebenarnya hanya Allah yang mengetahui secara pasti,
            atau memerlukan rujukan pada ayat-ayat yang lebih jelas (muhkamat).
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Pembagian ini berlandaskan Surah Ali &apos;Imran (3:7): sebagian ayat
            bersifat muhkamat (jelas, menjadi pokok) dan sebagian lagi mutashabihat.
            Para ulama menafsirkan kelompok mutashabihat dengan merujuk kembali pada
            ayat-ayat muhkamat.
          </p>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Catatan: istilah ini berbeda dengan <em>mutashabihat lafzhi</em> — ayat yang
          serupa redaksi antar surah, yang menjadi tantangan para penghafal (huffaz).
          Modul di bawah adalah alat bantu praktis untuk huffaz mengenali kemiripan
          lafaz tersebut; pemahaman makna tetap merujuk pada definisi ulama di atas.
        </p>
      </div>

      <MutashabihatExplorer />

      <footer className="text-xs leading-6 text-slate-400 dark:text-slate-500">
        <p className="font-semibold">Rujukan:</p>
        <ul className="list-disc pl-5">
          <li>
            Memahami Ayat Muhkamat dan Mutasyabihat — Universitas Islam Indonesia (alrasikh.uii.ac.id)
          </li>
          <li>
            Pengertian Ulumul Qur&apos;an (materi perkuliahan Ulumul Qur&apos;an, IAIN Pontianak)
          </li>
          <li>
            Dataset kelompok lafaz serupa untuk huffaz: Waqar144/Quran_Mutashabihat_Data
          </li>
        </ul>
      </footer>
    </div>
  );
}
