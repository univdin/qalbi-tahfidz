import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { SURAHS } from "@/lib/surahs";

const JUZ_30_START = 78;

export const metadata: Metadata = {
  title: "Pilih Surah — QalbiTahfidz",
  description:
    "Daftar 114 surah Al-Qur'an untuk dibaca dan dihafal anak: mulai dari Juz Amma (Juz 30) atau pilih surah lain. Murottal per ayat, mushaf Uthmani/IndoPak, dan terjemahan Indonesia.",
  alternates: { canonical: "/reader" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/reader`,
    title: "Pilih Surah — QalbiTahfidz",
    description:
      "Daftar 114 surah Al-Qur'an untuk dibaca dan dihafal anak dengan murottal per ayat, Tikrar, dan FSRS.",
  },
};

export default function ReaderIndexPage() {
  const juz30 = SURAHS.filter((s) => s.number >= JUZ_30_START);
  const lainnya = SURAHS.filter((s) => s.number < JUZ_30_START);

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
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Daftar Surah Al-Qur'an",
    itemListElement: SURAHS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Surah ${s.nameId} (${s.nameArabic})`,
      description: `${s.ayahCount} ayat, diturunkan di ${s.revelation}`,
      url: absoluteUrl(`/reader/${s.number}`),
    })),
  };

  const renderGrid = (list: typeof SURAHS) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => (
        <Link key={s.number} href={`/reader/${s.number}`}>
          <Card className="transition-colors hover:border-emerald-400 hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 font-arabic text-lg font-bold text-white">
                {s.number}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
                  {s.nameArabic} · {s.nameId}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {s.ayahCount} ayat · {s.revelation}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdItemList} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Pilih Surah
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Mulai dari Juz 30 (dianjurkan untuk tahfidz anak) atau pilih surah lain.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Mode baca:
          </span>
          <Link href="/reader" className="font-semibold text-emerald-600 hover:underline">
            Surah
          </Link>
          <Link href="/juz" className="font-semibold text-emerald-600 hover:underline">
            Juz
          </Link>
          <Link href="/halaman" className="font-semibold text-emerald-600 hover:underline">
            Halaman
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-600">
          Juz Amma (30)
        </h2>
        {renderGrid(juz30)}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Surah Lainnya
        </h2>
        {renderGrid(lainnya)}
      </section>
    </div>
  );
}
