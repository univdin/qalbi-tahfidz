import type { Metadata } from "next";
import { MutashabihatExplorer } from "@/components/mutashabihat/MutashabihatExplorer";

export const metadata: Metadata = {
  title: "Mutashabihat — Ayat Mirip — QalbiTahfidz",
  description:
    "Bandingkan ayat-ayat Al-Qur'an yang mirip (mutashabihat) berdampingan dengan penyorotan perbedaan kata — alat bantu hafalan agar tidak tertukar.",
  robots: { index: true, follow: true },
};

export default function MutashabihatPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Mutashabihat — Ayat Mirip
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bandingkan ayat yang mirip secara berdampingan; kata yang berbeda
          disorot agar hafalan tidak tertukar. Data: Waqar144/Quran_Mutashabihat_Data.
        </p>
      </div>
      <MutashabihatExplorer />
    </div>
  );
}
