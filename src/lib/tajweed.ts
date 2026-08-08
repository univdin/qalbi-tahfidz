export interface TajweedRange {
  rule: string;
  start: number;
  end: number;
}

export interface TajweedData {
  v: number;
  rules: Record<string, string>;
  surahs: Record<string, { a: number; r: [string, number, number][] }[]>;
}

export const TAJWEED_RULES: Record<
  string,
  { label: string; color: string }
> = {
  g: { label: "Ghunnah", color: "#10b981" },
  d: { label: "Idgham bi Ghunnah", color: "#f59e0b" },
  n: { label: "Idgham bilaa Ghunnah", color: "#f59e0b" },
  j: { label: "Idgham Mutajaanisain", color: "#f59e0b" },
  b: { label: "Idgham Mutaqaaribain", color: "#f59e0b" },
  f: { label: "Idgham Shafawi", color: "#f59e0b" },
  k: { label: "Ikhfa", color: "#8b5cf6" },
  w: { label: "Ikhfa Shafawi", color: "#8b5cf6" },
  i: { label: "Iqlab", color: "#3b82f6" },
  o: { label: "Mad 2 harakat", color: "#ef4444" },
  m: { label: "Mad 2/4/6 harakat", color: "#ef4444" },
  t: { label: "Mad Muttasil", color: "#ef4444" },
  f2: { label: "Mad Munfasil", color: "#ef4444" },
  x: { label: "Mad Lazim", color: "#ef4444" },
  q: { label: "Qalqalah", color: "#ec4899" },
  h: { label: "Hamzatul Wasl", color: "#14b8a6" },
  l: { label: "Lam Syamsiyah", color: "#64748b" },
  e: { label: "Silent", color: "#9ca3af" },
};

let cache: TajweedData | null = null;

export async function getTajweedData(): Promise<TajweedData> {
  if (cache) return cache;
  const res = await fetch("/data/tajweed.json");
  if (!res.ok) throw new Error("Gagal memuat data tajwid.");
  cache = (await res.json()) as TajweedData;
  return cache;
}

export function getSurahTajweed(
  surah: number,
  data: TajweedData
): Map<number, TajweedRange[]> {
  const entries = data.surahs[String(surah)] ?? [];
  const map = new Map<number, TajweedRange[]>();
  for (const e of entries) {
    map.set(
      e.a,
      e.r.map(([rule, start, end]) => ({ rule, start, end }))
    );
  }
  return map;
}

/** Teks Tanzil Uthmani Hafs — sumber yang indeks tajwid-nya presisi. */
export async function fetchTanzilUthmani(
  surah: number
): Promise<Map<number, string>> {
  const res = await fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf/${surah}.json`
  );
  if (!res.ok) {
    throw new Error("Gagal mengambil teks Tanzil Uthmani.");
  }
  const json = (await res.json()) as {
    chapter: { verse: number; text: string }[];
  };
  return new Map(json.chapter.map((v) => [v.verse, v.text]));
}
