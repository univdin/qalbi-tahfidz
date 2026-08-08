import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JUZ_RANGES } from "@/data/quranBounds";
import { ReadingMode } from "@/components/quran/ReadingMode";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSurahMeta } from "@/lib/surahs";
import { absoluteUrl, SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > 30) {
    return { title: "Juz tidak ditemukan", robots: { index: false } };
  }
  const title = `Juz ${n} Al-Qur'an Lengkap — QalbiTahfidz`;
  const description = `Baca Juz ${n} Al-Qur'an lengkap dengan terjemahan Indonesia, mushaf Uthmani & IndoPak, audio murottal per ayat, dan jadwal ulangan hafalan.`;

  return {
    title,
    description,
    alternates: { canonical: `/juz/${n}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/juz/${n}`,
      title,
      description,
      siteName: "QalbiTahfidz",
    },
  };
}

export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function JuzPage({ params }: Props) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > 30) notFound();
  const ranges = JUZ_RANGES[n - 1];

  const surahNames = ranges
    .map((r) => getSurahMeta(r.s)?.nameId)
    .filter(Boolean)
    .join(", ");

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Daftar Juz", item: absoluteUrl("/juz") },
      { "@type": "ListItem", position: 3, name: `Juz ${n}`, item: absoluteUrl(`/juz/${n}`) },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Apa saja surah yang ada di dalam Juz ${n}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Juz ${n} mencakup surah-surah berikut: ${surahNames}.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdFaq} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Juz {n}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Cakupan Surah: <span className="font-semibold text-slate-700 dark:text-slate-200">{surahNames}</span>
        </p>
      </div>
      <ReadingMode ranges={ranges} />
    </div>
  );
}
