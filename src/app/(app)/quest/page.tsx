import type { Metadata } from "next";
import { JuzAmmaQuest } from "@/components/quest/JuzAmmaQuest";

export const metadata: Metadata = {
  title: "Quest Hafalan Juz Amma — QalbiTahfidz",
  description:
    "Jalur hafalan Juz 30 bertahap: misi 2–5 ayat, bintang, dan progres untuk anak menghafal dengan konsisten.",
  robots: { index: false, follow: false },
};

export default function QuestPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Quest Hafalan Juz Amma
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selesaikan misi hafalan Juz 30 langkah demi langkah dan pantau
          progres bintangmu.
        </p>
      </div>
      <JuzAmmaQuest />
    </div>
  );
}
