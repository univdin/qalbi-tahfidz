import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAmalan } from "@/lib/amalan";
import { ReadingMode } from "@/components/quran/ReadingMode";

interface Props {
  params: Promise<{ slug: string }>;
}

const TAHLIL_DOA = [
  "إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ الْفَاتِحَةُ",
  "لَا إِلَهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
  "سُبْحَانَ اللهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
  "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getAmalan(slug);
  if (!a) return { title: "Amalan tidak ditemukan", robots: { index: false } };
  return {
    title: `${a.title} — QalbiTahfidz`,
    description: a.desc,
  };
}

export default async function AmalanPage({ params }: Props) {
  const { slug } = await params;
  const a = getAmalan(slug);
  if (!a) notFound();
  const ranges = [{ s: a.surah, start: a.start, end: a.end }];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {a.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
      </div>

      <ReadingMode ranges={ranges} />

      {a.tahlil && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Bacaan Tahlil (ringkas)
          </h2>
          <div className="mt-3 flex flex-col gap-2" lang="ar" dir="rtl">
            {TAHLIL_DOA.map((d, i) => (
              <p key={i} className="font-arabic text-xl leading-loose text-slate-800 dark:text-slate-100">
                {d}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
