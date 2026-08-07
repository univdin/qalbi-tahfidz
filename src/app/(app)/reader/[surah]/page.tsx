import { notFound } from "next/navigation";
import { getSurahMeta } from "@/lib/surahs";
import { SurahReader } from "@/components/quran/SurahReader";

interface ReaderDetailProps {
  params: Promise<{ surah: string }>;
}

export async function generateMetadata({ params }: ReaderDetailProps) {
  const { surah } = await params;
  const number = Number(surah);
  const meta = getSurahMeta(number);
  return {
    title: meta ? `${meta.nameId} — QalbiTahfidz` : "Surah — QalbiTahfidz",
  };
}

export default async function ReaderDetailPage({ params }: ReaderDetailProps) {
  const { surah } = await params;
  const number = Number(surah);
  if (!Number.isInteger(number) || number < 1 || number > 114 || !getSurahMeta(number)) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <SurahReader surahNumber={number} />
    </div>
  );
}
