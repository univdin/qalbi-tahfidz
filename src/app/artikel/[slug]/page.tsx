import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle } from "@/data/articles";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return { title: "Artikel tidak ditemukan", robots: { index: false } };
  }
  return {
    title: `${article.title} — QalbiTahfidz`,
    description: article.description,
    alternates: { canonical: `/artikel/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/artikel/${slug}`,
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArtikelPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: absoluteUrl(`/artikel/${slug}`),
    inLanguage: "id",
    publisher: {
      "@type": "Organization",
      name: "QalbiTahfidz",
      url: SITE_URL,
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <JsonLd data={jsonLdArticle} />
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
          {article.category}
        </span>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
          {article.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {article.description}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {article.paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-8 text-slate-700 dark:text-slate-200">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
