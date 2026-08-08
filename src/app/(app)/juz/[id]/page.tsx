import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JUZ_RANGES } from "@/data/quranBounds";
import { ReadingMode } from "@/components/quran/ReadingMode";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > 30) {
    return { title: "Juz tidak ditemukan", robots: { index: false } };
  }
  return {
    title: `Juz ${n} — QalbiTahfidz`,
    description: `Baca Juz ${n} Al-Qur'an lengkap dengan terjemahan Indonesia dan audio per ayat.`,
  };
}

export default async function JuzPage({ params }: Props) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > 30) notFound();
  const ranges = JUZ_RANGES[n - 1];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Juz {n}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {ranges.length} bagian surah · {ranges.map((r) => r.s).join(", ")}
        </p>
      </div>
      <ReadingMode ranges={ranges} />
    </div>
  );
}
