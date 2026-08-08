import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchDynamicSurah } from "@/services/quranDataService";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { getSurahMeta, SURAHS } from "@/lib/surahs";
import { getSurahJuzStart, getSurahPageStart } from "@/data/quranBounds";
import { AyahAudioEngine } from "@/components/quran/AyahAudioEngine";
import { BookmarkButton } from "@/components/quran/BookmarkButton";
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";

interface AyahPageProps {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({
  params,
}: AyahPageProps): Promise<Metadata> {
  const { surah, ayah } = await params;
  const sNum = Number(surah);
  const aNum = Number(ayah);
  const meta = getSurahMeta(sNum);

  if (!meta || !Number.isInteger(sNum) || !Number.isInteger(aNum) || aNum < 1 || aNum > meta.ayahCount) {
    return {
      title: "Ayat tidak ditemukan",
      robots: { index: false },
    };
  }

  const title = `Surah ${meta.nameId} Ayat ${aNum} (${meta.nameArabic}) — Terjemahan & Tafsir | QalbiTahfidz`;
  const description = `Baca teks Arab, terjemahan Indonesia, tafsir Kemenag, dan dengarkan audio murottal Surah ${meta.nameId} (${sNum}) Ayat ${aNum}. Pembelajaran tahfidz dengan Metode Ummi & FSRS.`;

  return {
    title,
    description,
    alternates: { canonical: `/reader/${sNum}/${aNum}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/reader/${sNum}/${aNum}`,
      title,
      description,
      siteName: "QalbiTahfidz",
      locale: "id_ID",
      images: [{ url: absoluteUrl(`/api/og/${sNum}/${aNum}`), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(`/api/og/${sNum}/${aNum}`)],
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ surah: string; ayah: string }> = [];
  const prioritySurahs = [1, 2, 36, 67, 56, 18, 55, ...SURAHS.filter((s) => s.number >= 78).map((s) => s.number)];
  
  for (const s of prioritySurahs) {
    const meta = getSurahMeta(s);
    if (!meta) continue;
    const limit = Math.min(meta.ayahCount, 10);
    for (let a = 1; a <= limit; a++) {
      params.push({ surah: String(s), ayah: String(a) });
    }
  }
  return params;
}

export default async function DedicatedAyahPage({ params }: AyahPageProps) {
  const { surah, ayah } = await params;
  const sNum = Number(surah);
  const aNum = Number(ayah);
  const meta = getSurahMeta(sNum);

  if (!meta || !Number.isInteger(sNum) || !Number.isInteger(aNum) || aNum < 1 || aNum > meta.ayahCount) {
    notFound();
  }

  let surahData;
  try {
    surahData = await fetchDynamicSurah(sNum);
  } catch {
    notFound();
  }

  const verse = surahData.verses.find((v) => v.number === aNum);
  if (!verse) notFound();

  const prevAyah = aNum > 1 ? aNum - 1 : null;
  const nextAyah = aNum < meta.ayahCount ? aNum + 1 : null;

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Pilih Surah", item: absoluteUrl("/reader") },
      { "@type": "ListItem", position: 3, name: meta.nameId, item: absoluteUrl(`/reader/${sNum}`) },
      { "@type": "ListItem", position: 4, name: `Ayat ${aNum}`, item: absoluteUrl(`/reader/${sNum}/${aNum}`) },
    ],
  };

  const jsonLdQAPage = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: `Apa teks, terjemahan, dan tafsir Surah ${meta.nameId} ayat ${aNum}?`,
      text: `Bagaimana teks Arab uthmani, terjemahan bahasa Indonesia, dan penjelasan tafsir Kemenag untuk Surah ${meta.nameId} (${sNum}) ayat ${aNum}?`,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Teks Arab: ${verse.textArabicUthmani}. Terjemahan: "${verse.translationId ?? ""}". Tafsir Kemenag: ${verse.tafsirId ?? "Tafsir belum tersedia."}`,
        upvoteCount: 100,
        url: absoluteUrl(`/reader/${sNum}/${aNum}`),
      },
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdQAPage} />

      {/* Nav Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          href={`/reader/${sNum}#ayah-${aNum}`}
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Surah {meta.nameId}
        </Link>
        <span>
          Surah {sNum} · Ayat {aNum} dari {meta.ayahCount}
        </span>
      </div>

      {/* Main Ayah Card */}
      <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow">
              {aNum}
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Surah {meta.nameId} ({meta.nameArabic}) — Ayat {aNum}
              </h1>
              <p className="text-xs text-slate-500">
                {meta.revelation} · Juz {getSurahJuzStart(sNum)} · Halaman {getSurahPageStart(sNum)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AyahAudioEngine
              surahNumber={sNum}
              ayahNumber={aNum}
              ayahIndex={aNum - 1}
              reciter="mishari"
            />
            <BookmarkButton surah={sNum} ayah={aNum} />
          </div>
        </div>

        {/* Arabic Text */}
        <div className="my-2 text-right">
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-3xl leading-[2.2] text-slate-900 dark:text-slate-50 sm:text-4xl"
          >
            {verse.textArabicUthmani}
          </p>
        </div>

        {/* Indonesian Translation */}
        {verse.translationId && (
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Terjemahan Bahasa Indonesia
            </p>
            <p className="text-base leading-7 text-slate-700 dark:text-slate-200">
              {verse.translationId}
            </p>
          </div>
        )}

        {/* Tafsir Kemenag RI */}
        {verse.tafsirId && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-1">
              Tafsir Kemenag RI
            </p>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
              {verse.tafsirId}
            </p>
          </div>
        )}

        {/* CTA to Full Surah */}
        <div className="mt-2 flex flex-col items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Link
            href={`/reader/${sNum}#ayah-${aNum}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            <BookOpen className="h-4 w-4" /> Baca Surah {meta.nameId} Selengkapnya ({meta.ayahCount} ayat)
          </Link>
        </div>
      </article>

      {/* Prev / Next Ayah Nav */}
      <div className="flex items-center justify-between gap-4">
        {prevAyah ? (
          <Link
            href={`/reader/${sNum}/${prevAyah}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" /> Ayat {prevAyah}
          </Link>
        ) : (
          <div />
        )}

        {nextAyah ? (
          <Link
            href={`/reader/${sNum}/${nextAyah}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Ayat {nextAyah} <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
