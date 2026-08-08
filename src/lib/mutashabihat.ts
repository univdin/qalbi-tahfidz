export interface VerseRef {
  s: number;
  a1: number;
  a2: number;
}

export interface MutashabihatGroup {
  src: VerseRef;
  muts: VerseRef[];
  ctx: number;
}

export interface MutashabihatData {
  v: number;
  juzs: Record<string, MutashabihatGroup[]>;
}

let cache: MutashabihatData | null = null;

export async function getMutashabihatData(): Promise<MutashabihatData> {
  if (cache) return cache;
  const res = await fetch("/data/mutashabihat.json");
  if (!res.ok) throw new Error("Gagal memuat data mutashabihat.");
  cache = (await res.json()) as MutashabihatData;
  return cache;
}

export function verseRefLabel(ref: VerseRef): string {
  return ref.a2 > ref.a1 ? `${ref.s}:${ref.a1}-${ref.a2}` : `${ref.s}:${ref.a1}`;
}

const TASHKEEL = /[\u064B-\u065F\u0670\u0640]/g;

function stripTashkeel(word: string): string {
  return word.replace(TASHKEEL, "");
}

export type DiffStatus = "same" | "onlyA" | "onlyB";

export interface DiffToken {
  word: string;
  status: DiffStatus;
}

export interface WordDiff {
  a: DiffToken[];
  b: DiffToken[];
}

/**
 * LCS word-level diff. Kata yang sama (tanpa tashkeel) dianggap cocok.
 * Kata yang hanya ada di sisi A ditandai onlyA; hanya di sisi B ditandai onlyB.
 */
export function diffWords(aText: string, bText: string): WordDiff {
  const a = aText.split(" ").filter(Boolean);
  const b = bText.split(" ").filter(Boolean);
  const sa = a.map(stripTashkeel);
  const sb = b.map(stripTashkeel);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        sa[i] === sb[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const matchedA = new Set<number>();
  const matchedB = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (sa[i] === sb[j]) {
      matchedA.add(i);
      matchedB.add(j);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  return {
    a: a.map((word, idx) => ({
      word,
      status: matchedA.has(idx) ? ("same" as const) : ("onlyA" as const),
    })),
    b: b.map((word, idx) => ({
      word,
      status: matchedB.has(idx) ? ("same" as const) : ("onlyB" as const),
    })),
  };
}
