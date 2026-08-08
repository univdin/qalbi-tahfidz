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
  { label: string; color: string; desc: string }
> = {
  g: { label: "Ghunnah", color: "#10b981", desc: "Dengung 1–2 harakat pada nun/meem bertasydid." },
  d: { label: "Idgham bi Ghunnah", color: "#f59e0b", desc: "Nun sukun/tanwin melebur ke huruf (ي ن م و) disertai dengung." },
  n: { label: "Idgham bilaa Ghunnah", color: "#f59e0b", desc: "Nun sukun/tanwin melebur ke huruf (ل ر) tanpa dengung." },
  j: { label: "Idgham Mutajaanisain", color: "#f59e0b", desc: "Melebur dua huruf sejenis makhraj." },
  b: { label: "Idgham Mutaqaaribain", color: "#f59e0b", desc: "Melebur dua huruf berdekatan makhraj." },
  f: { label: "Idgham Shafawi", color: "#f59e0b", desc: "Meem sukun melebur ke meem berikutnya." },
  k: { label: "Ikhfa", color: "#8b5cf6", desc: "Nun sukun/tanwin disamarkan tanpa dengung (15 huruf ikhfa)." },
  w: { label: "Ikhfa Shafawi", color: "#8b5cf6", desc: "Meem sukun disamarkan di hadapan ba." },
  i: { label: "Iqlab", color: "#3b82f6", desc: "Nun sukun/tanwin berubah menjadi meem tersembunyi sebelum ba." },
  o: { label: "Mad 2 harakat", color: "#ef4444", desc: "Panjang bacaan 2 harakat." },
  m: { label: "Mad 2/4/6 harakat", color: "#ef4444", desc: "Panjang boleh 2, 4, atau 6 harakat (mad aarid/leen)." },
  t: { label: "Mad Muttasil", color: "#ef4444", desc: "Panjang 4–5 harakat; hamzah dalam kata yang sama." },
  f2: { label: "Mad Munfasil", color: "#ef4444", desc: "Panjang 4–5 harakat; hamzah pada kata berikutnya." },
  x: { label: "Mad Lazim", color: "#ef4444", desc: "Panjang wajib 6 harakat." },
  q: { label: "Qalqalah", color: "#ec4899", desc: "Pantulan suara pada huruf (ق ط ب ج د) saat sukun." },
  h: { label: "Hamzatul Wasl", color: "#14b8a6", desc: "Hamzah yang tidak dibaca ketika disambung." },
  l: { label: "Lam Syamsiyah", color: "#64748b", desc: "Lam tidak dibaca, diidghamkan ke huruf syamsiyah." },
  e: { label: "Silent", color: "#9ca3af", desc: "Huruf tidak dibaca (sukun yang dihilangkan)." },
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
