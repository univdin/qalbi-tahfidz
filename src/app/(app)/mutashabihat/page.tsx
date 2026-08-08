import type { Metadata } from "next";
import { MutashabihatExplorer } from "@/components/mutashabihat/MutashabihatExplorer";

export const metadata: Metadata = {
  title: "Mutashabihat — Ayat Mirip Redaksi — QalbiTahfidz",
  description:
    "Alat bantu huffaz mengenali ayat-ayat yang mirip redaksi (mutashabihat lafzhi) antar surah — bandingkan berdampingan dengan penyorotan perbedaan kata agar hafalan tidak tertukar.",
  robots: { index: true, follow: true },
};

export default function MutashabihatPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Mutashabihat — Ayat Mirip Redaksi
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <strong>Mutashabihat Lafzhi</strong> adalah ayat-ayat yang serupa
          redaksi namun berada di surah berbeda — salah satu tantangan utama
          para penghafal (huffaz). Modul ini mengelompokkan ayat yang sering
          membuat huffaz tertukar, menampilkan perbandingan berdampingan dengan
          kata yang berbeda disorot. Catatan: ini berbeda dari pembagian klasik
          <em> muhkam </em>dan<em> mutashabih </em>(Ali &apos;Imran 3:7) yang
          terkait kejelasan makna.
        </p>
      </div>
      <MutashabihatExplorer />
    </div>
  );
}
