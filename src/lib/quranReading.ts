import type { Range } from "@/data/quranBounds";
import { fetchDynamicSurah } from "@/services/quranDataService";

export async function fetchRangesText(
  ranges: Range[]
): Promise<Record<number, Awaited<ReturnType<typeof fetchDynamicSurah>>>> {
  const surahs = [...new Set(ranges.map((r) => r.s))];
  const results = await Promise.all(
    surahs.map((s) => fetchDynamicSurah(s).catch(() => null))
  );
  const map: Record<number, Awaited<ReturnType<typeof fetchDynamicSurah>>> = {};
  for (const d of results) {
    if (d) map[d.surahNumber] = d;
  }
  return map;
}
