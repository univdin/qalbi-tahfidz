import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { StoryExplorer } from "@/components/story/StoryExplorer";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kisah dalam Al-Qur'an — QalbiTahfidz",
  description:
    "Jelajahi kisah para nabi dan kisah pilihan dalam Al-Qur'an sebagai peta interaktif: dari peristiwa hingga ayat rujukan, lengkap dengan nilai akhlak.",
  alternates: { canonical: "/kisah" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/kisah`,
    title: "Kisah dalam Al-Qur'an — QalbiTahfidz",
    description:
      "Peta interaktif kisah para nabi & kisah pilihan dengan navigasi langsung ke ayat Al-Qur'an.",
  },
};

export default function KisahPage() {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kisah dalam Al-Qur'an",
        item: absoluteUrl("/kisah"),
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Kisah dalam Al-Qur&apos;an
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Peta interaktif kisah para nabi &amp; kisah pilihan — pilih kisah, ikuti
          alur peristiwa, dan lompat langsung ke ayat rujukannya.
        </p>
      </div>
      <StoryExplorer />
    </div>
  );
}
