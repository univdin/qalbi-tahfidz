import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { UmmiPlayer } from "@/components/ummi/UmmiPlayer";
import { DownloadJuz30 } from "@/components/ummi/DownloadJuz30";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { getSurahMeta, SURAHS } from "@/lib/surahs";
import { UMMI_JUZ30, UMMI_SOURCE } from "@/lib/ummiAudio";

export const metadata: Metadata = {
  title: "Metode Ummi — Murottal Anak Juz 30 (Nada Nahawand)",
  description:
    "Pemutar murottal anak Juz 30 (surah 78–114) dengan nada Metode Ummi / Nada Nahawand bersuara anak-anak. Dengarkan, ulangi, dan hafalkan dengan kecepatan yang nyaman.",
  alternates: { canonical: "/ummi" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/ummi`,
    title: "Metode Ummi — Murottal Anak Juz 30",
    description:
      "37 surah Juz 30 dengan nada Metode Ummi/Nahawand bersuara anak-anak — pemutar khusus untuk menghafal anak.",
  },
};

export default function UmmiPage() {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Metode Ummi — Murottal Anak Juz 30",
        item: absoluteUrl("/ummi"),
      },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Murottal Anak Juz 30 Metode Ummi",
    itemListElement: UMMI_JUZ30.map((entry, i) => {
      const meta = getSurahMeta(entry.surah);
      return {
        "@type": "ListItem",
        position: i + 1,
        name: `Surah ${meta?.nameId ?? entry.surah} (${meta?.nameArabic ?? ""})`,
        description: `${meta?.ayahCount ?? ""} ayat — murottal anak metode ummi (nada nahawand)`,
        url: absoluteUrl("/ummi"),
      };
    }),
  };

  const surahCount = SURAHS.filter((s) => s.number >= 78).length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdItemList} />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
          Modul Khusus · Juz 30 ({surahCount} surah)
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Metode Ummi — Murottal Anak (Nada Nahawand)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Murottal Juz 30 dengan suara anak-anak bernada Metode Ummi/Nahawand.
          Cocok untuk anak menirukan dan menghafal. Putar satu surah, ulangi
          segmen (A–B), atau biarkan lanjut otomatis ke surah berikutnya.
        </p>
      </div>

      <UmmiPlayer />

      <DownloadJuz30 />

      <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
        Sumber audio:{" "}
        <a
          href={UMMI_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:underline"
        >
          {UMMI_SOURCE.creator} · archive.org ({UMMI_SOURCE.year})
        </a>
        . File murottal anak Metode Ummi Juz 30 yang diunggah di archive.org;
        lisensi eksplisit tidak dideklarasikan oleh pengunggah.
      </p>
    </div>
  );
}
