import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STORIES, MORAL_TAG_LABEL, MORAL_TAG_COLOR } from "@/data/stories";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { ArrowLeft, BookMarked, ExternalLink } from "lucide-react";

interface StorySlugProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StorySlugProps): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES.find((s) => s.id === slug);

  if (!story) {
    return { title: "Kisah tidak ditemukan", robots: { index: false } };
  }

  const title = `${story.title} — Kisah dalam Al-Qur'an | QalbiTahfidz`;
  const description = `${story.desc} Pelajari alur peristiwa, ayat rujukan, dan hikmah nilai akhlak dari kisah ${story.title} di Al-Qur'an.`;

  return {
    title,
    description,
    alternates: { canonical: `/kisah/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/kisah/${slug}`,
      title,
      description,
      siteName: "QalbiTahfidz",
      locale: "id_ID",
    },
  };
}

export async function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.id }));
}

export default async function StorySlugPage({ params }: StorySlugProps) {
  const { slug } = await params;
  const story = STORIES.find((s) => s.id === slug);

  if (!story) notFound();

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Kisah dalam Al-Qur'an", item: absoluteUrl("/kisah") },
      { "@type": "ListItem", position: 3, name: story.title, item: absoluteUrl(`/kisah/${slug}`) },
    ],
  };

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.desc,
    url: absoluteUrl(`/kisah/${slug}`),
    publisher: {
      "@type": "Organization",
      name: "QalbiTahfidz",
      url: SITE_URL,
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdArticle} />

      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          href="/kisah"
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Peta Kisah
        </Link>
      </div>

      <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BookMarked className="h-7 w-7 text-emerald-600 shrink-0" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {story.title}
            </h1>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {story.desc}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Nilai Akhlak:</span>
            {story.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: MORAL_TAG_COLOR[t] }}
              >
                {MORAL_TAG_LABEL[t]}
              </span>
            ))}
          </div>
        </div>

        {/* Story Nodes Breakdown */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Alur Peristiwa & Ayat Rujukan:
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {story.nodes.map((node, i) => {
              const [surahStr, ayahStr] = node.ref.split(":");
              return (
                <div
                  key={node.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {node.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Surah {surahStr} Ayat {ayahStr}
                    </p>
                    <Link
                      href={`/reader/${surahStr}/${ayahStr}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Buka Ayat {surahStr}:{ayahStr} <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
