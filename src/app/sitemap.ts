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

  // Priority Ayah Routes (Juz Amma + Key Surahs)
  const priorityAyahRoutes: MetadataRoute.Sitemap = [];
  const prioritySurahs = [1, 2, 36, 67, 56, 18, 55, ...SURAHS.filter((s) => s.number >= 78).map((s) => s.number)];
  for (const sNum of prioritySurahs) {
    const meta = SURAHS.find((s) => s.number === sNum);
    if (!meta) continue;
    const limit = Math.min(meta.ayahCount, 10);
    for (let a = 1; a <= limit; a++) {
      priorityAyahRoutes.push({
        url: `${SITE_URL}/reader/${sNum}/${a}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
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
    ...priorityAyahRoutes,
    ...articleRoutes,
    ...amalanRoutes,
  ];
}
