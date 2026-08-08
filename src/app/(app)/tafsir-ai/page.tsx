import type { Metadata } from "next";
import { TafsirAiChat } from "@/components/ai/TafsirAiChat";
import { DashboardNav } from "@/components/nav/DashboardNav";

export const metadata: Metadata = {
  title: "Tanya Tafsir AI — QalbiTahfidz",
  description:
    "Tanyakan makna ayat, asbabun nuzul, atau tema Al-Qur'an. Jawaban AI berbasis Tafsir Kemenag RI dengan rujukan ayat.",
  robots: { index: false, follow: false },
};

export default function TafsirAiPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-8 pb-24 sm:pb-8">
      <DashboardNav />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Tanya Tafsir AI
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ajukan pertanyaan seputar Al-Qur&apos;an. AI akan mencari ayat yang
          relevan, merujuk Tafsir Kemenag RI, lalu menjawab dengan kutipan ayat.
        </p>
      </div>
      <TafsirAiChat />
    </div>
  );
}
