import type { Metadata } from "next";
import { MoralBrowser } from "@/components/story/MoralBrowser";

export const metadata: Metadata = {
  title: "Nilai Akhlak dalam Al-Qur'an — QalbiTahfidz",
  description:
    "Jelajahi ayat-ayat Al-Qur'an berdasarkan nilai akhlak: kejujuran, kesabaran, tawakal, kasih sayang, syukur, keberanian, dan lainnya.",
  robots: { index: true, follow: true },
};

export default function AkhlakPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Nilai Akhlak dalam Al-Qur&apos;an
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ayat-ayat pilihan yang menggambarkan nilai-nilai karakter, diambil
          dari kisah-kisah dalam Al-Qur&apos;an.
        </p>
      </div>
      <MoralBrowser />
    </div>
  );
}
