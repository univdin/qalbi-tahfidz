import type { MetadataRoute } from "next";
import { SURAHS } from "@/lib/surahs";
import { STORIES } from "@/data/stories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/reader`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ummi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/mutashabihat`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/kisah`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/juz`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/halaman`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/artikel`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/amalan`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/akhlak`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const surahRoutes: MetadataRoute.Sitemap = SURAHS.map((s) => ({
    url: `${SITE_URL}/reader/${s.number}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const juzRoutes: MetadataRoute.Sitemap = Array.from({ length: 30 }, (_, i) => ({
    url: `${SITE_URL}/juz/${i + 1}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const kisahRoutes: MetadataRoute.Sitemap = STORIES.map((s) => ({
    url: `${SITE_URL}/kisah/${s.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Full Ayah Coverage (6.236 URL) — KR2.1: semua ayat terindeks.
  // Priority tinggi (Juz Amma + surah kunci) vs long-tail (hemat crawl budget).
  const prioritySurahs = [1, 2, 36, 67, 56, 18, 55, ...SURAHS.filter((s) => s.number >= 78).map((s) => s.number)];
  const ayahRoutes: MetadataRoute.Sitemap = [];
  for (const meta of SURAHS) {
    const isPriority = prioritySurahs.includes(meta.number);
    for (let a = 1; a <= meta.ayahCount; a++) {
      ayahRoutes.push({
        url: `${SITE_URL}/reader/${meta.number}/${a}`,
        lastModified: now,
        changeFrequency: isPriority ? "monthly" : "yearly",
        priority: isPriority ? 0.6 : 0.4,
      });
    }
  }

  const articleRoutes: MetadataRoute.Sitemap = [
    "ayat-kursi",
    "seribu-dinar",
    "nuzulul-quran",
    "keutamaan-al-mulk",
    "keutamaan-al-waqiah",
  ].map((slug) => ({
    url: `${SITE_URL}/artikel/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const amalanRoutes: MetadataRoute.Sitemap = [
    "yasin-tahlil",
    "al-kahfi",
    "al-waqiah",
    "al-mulk",
  ].map((slug) => ({
    url: `${SITE_URL}/amalan/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...surahRoutes,
    ...juzRoutes,
    ...kisahRoutes,
    ...ayahRoutes,
    ...articleRoutes,
    ...amalanRoutes,
  ];
}
