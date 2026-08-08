import { getSurahMeta, SURAHS } from "@/lib/surahs";

export interface Quest {
  id: string;
  surah: number;
  start: number;
  end: number;
  title: string;
  seq: number;
}

const CHUNK = 5;

export function generateJuz30Quests(): Quest[] {
  const quests: Quest[] = [];
  let seq = 1;
  for (const s of SURAHS.filter((x) => x.number >= 78)) {
    const total = s.ayahCount;
    for (let start = 1; start <= total; start += CHUNK) {
      const end = Math.min(start + CHUNK - 1, total);
      quests.push({
        id: `q-${s.number}-${start}-${end}`,
        surah: s.number,
        start,
        end,
        title: `${s.nameId} (${start}–${end})`,
        seq: seq++,
      });
    }
  }
  return quests;
}

export const JUZ30_QUESTS = generateJuz30Quests();

export function questMeta(quest: Quest) {
  return getSurahMeta(quest.surah);
}
