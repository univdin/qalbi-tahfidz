import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { SurahReader } from "@/components/quran/SurahReader";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { getSurahMeta } from "@/lib/surahs";

interface ReaderDetailProps {
  params: Promise<{ surah: string }>;
}

export async function generateMetadata({
  params,
}: ReaderDetailProps): Promise<Metadata> {
  const { surah } = await params;
  const number = Number(surah);
  const meta = getSurahMeta(number);

  if (!meta || !Number.isInteger(number) || number < 1 || number > 114) {
    return {
      title: "Surah tidak ditemukan",
      robots: { index: false },
    };
  }

  const title = `${meta.nameId} — QalbiTahfidz`;
  const description = `Baca, dengarkan, dan hafalkan Surah ${meta.nameId} (${meta.nameArabic}) — ${meta.ayahCount} ayat, surah ${meta.revelation}. Dilengkapi audio per ayat, mushaf Uthmani/IndoPak, terjemahan Indonesia, Tikrar, dan jadwal FSRS.`;

  return {
    title,
    description,
    alternates: { canonical: `/reader/${number}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/reader/${number}`,
      title,
      description,
      siteName: "QalbiTahfidz",
      locale: "id_ID",
    },
  };
}

export default async function ReaderDetailPage({
  params,
}: ReaderDetailProps) {
  const { surah } = await params;
  const number = Number(surah);
  const meta = getSurahMeta(number);
  if (!Number.isInteger(number) || number < 1 || number > 114 || !meta) {
    notFound();
  }

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pilih Surah",
        item: absoluteUrl("/reader"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.nameId,
        item: absoluteUrl(`/reader/${number}`),
      },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Berapa jumlah ayat dalam Surah ${meta.nameId}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Surah ${meta.nameId} (${meta.nameArabic}) terdiri dari ${meta.ayahCount} ayat.`,
        },
      },
      {
        "@type": "Question",
        name: `Surah ${meta.nameId} termasuk surah Makkiyah atau Madaniyah?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Surah ${meta.nameId} termasuk surah ${meta.revelation}.`,
        },
      },
      {
        "@type": "Question",
        name: `Bagaimana cara menghafal Surah ${meta.nameId} untuk anak?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Gunakan metode Tikrar: dengarkan audio per ayat dengan jeda hening, tirukan, ulangi N kali per ayat, lalu ulangi blok beberapa kali. QalbiTahfidz lalu menjadwalkan ulangan berjarak (FSRS) agar hafalan kuat.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdFaq} />
      <SurahReader surahNumber={number} />
    </div>
  );
}
