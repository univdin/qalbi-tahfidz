export interface AmalanConfig {
  slug: string;
  title: string;
  desc: string;
  surah: number;
  start: number;
  end: number;
  tahlil?: boolean;
}

export const AMALAN: AmalanConfig[] = [
  {
    slug: "yasin-tahlil",
    title: "Yasin & Tahlil",
    desc: "Surah Yasin (36) lengkap dengan bacaan tahlil — amalan rutin tradisi Nusantara.",
    surah: 36,
    start: 1,
    end: 83,
    tahlil: true,
  },
  {
    slug: "al-kahfi",
    title: "Al-Kahfi (Jumat)",
    desc: "Surah Al-Kahfi (18) — dianjurkan dibaca malam/ hari Jumat.",
    surah: 18,
    start: 1,
    end: 110,
  },
  {
    slug: "al-waqiah",
    title: "Al-Waqi'ah",
    desc: "Surah Al-Waqi'ah (56) — amalan kemudahan rezeki.",
    surah: 56,
    start: 1,
    end: 96,
  },
  {
    slug: "al-mulk",
    title: "Al-Mulk",
    desc: "Surah Al-Mulk (67) — pembela pembacanya, dianjurkan dibaca setiap malam.",
    surah: 67,
    start: 1,
    end: 30,
  },
];

export function getAmalan(slug: string): AmalanConfig | undefined {
  return AMALAN.find((a) => a.slug === slug);
}
