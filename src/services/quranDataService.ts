import { openDB } from "idb";

export interface SurahVerse {
  number: number;
  textArabicUthmani: string;
  textArabicIndopak: string;
  translationId: string;
  tafsirId?: string;
}

export interface DynamicSurahData {
  surahNumber: number;
  name: string;
  verses: SurahVerse[];
  source: "gadingnst" | "fawazahmed0_static" | "indexeddb_cache";
}

const API_ENDPOINTS = {
  GADING: "https://api.quran.gading.dev",
  FAWAZ_STATIC: "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1",
};

async function getLocalDb() {
  return openDB("QalbiTahfidzProductionDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("surahs")) {
        db.createObjectStore("surahs");
      }
      if (!db.objectStoreNames.contains("audio_recordings")) {
        db.createObjectStore("audio_recordings");
      }
      if (!db.objectStoreNames.contains("srs_outbox")) {
        db.createObjectStore("srs_outbox", { autoIncrement: true });
      }
    },
  });
}

interface GadingVerseDto {
  number: { inSurah: number };
  text: { arab: string; indopak?: string };
  translation: { id: string };
  tafsir?: { id?: { short?: string; long?: string } };
}

interface GadingResponse {
  data: {
    name: { transliteration: { id: string } };
    verses: GadingVerseDto[];
  };
}

interface FawazChapterItem {
  chapter: number;
  verse: number;
  text: string;
}

interface FawazResponse {
  chapter: FawazChapterItem[];
}

function toSurahVerse(dto: GadingVerseDto): SurahVerse {
  return {
    number: dto.number.inSurah,
    textArabicUthmani: dto.text.arab,
    textArabicIndopak: dto.text.indopak || dto.text.arab,
    translationId: dto.translation.id,
    tafsirId: dto.tafsir?.id?.short ?? "",
  };
}

export async function fetchDynamicSurah(
  surahNumber: number
): Promise<DynamicSurahData> {
  // IndexedDB is browser-only; on the server (SSG/prerender) skip the local cache.
  const canUseIdb = typeof indexedDB !== "undefined";
  const db = canUseIdb ? await getLocalDb() : null;

  const cached = db
    ? ((await db.get("surahs", surahNumber)) as DynamicSurahData | undefined)
    : undefined;

  if (cached && typeof navigator !== "undefined" && !navigator.onLine) {
    return { ...cached, source: "indexeddb_cache" };
  }

  try {
    const res = await fetch(`${API_ENDPOINTS.GADING}/surah/${surahNumber}`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const json = (await res.json()) as GadingResponse;
      const payload: DynamicSurahData = {
        surahNumber,
        name: json.data.name.transliteration.id,
        verses: json.data.verses.map(toSurahVerse),
        source: "gadingnst",
      };
      await db?.put("surahs", payload, surahNumber);
      return payload;
    }
  } catch {
    console.warn("Tier 2 API unavailable, shifting to Tier 3 Static Fallback...");
  }

  try {
    const [idRes, uthmaniRes, indopakRes] = await Promise.all([
      fetch(`${API_ENDPOINTS.FAWAZ_STATIC}/editions/ind-indonesianislam/${surahNumber}.json`),
      fetch(`${API_ENDPOINTS.FAWAZ_STATIC}/editions/ara-quranuthmanihaf/${surahNumber}.json`),
      fetch(`${API_ENDPOINTS.FAWAZ_STATIC}/editions/ara-quranindopak/${surahNumber}.json`),
    ]);
    if (idRes.ok && uthmaniRes.ok && indopakRes.ok) {
      const idJson = (await idRes.json()) as FawazResponse;
      const uthmaniJson = (await uthmaniRes.json()) as FawazResponse;
      const indopakJson = (await indopakRes.json()) as FawazResponse;

      const versesById = new Map<number, string>(
        uthmaniJson.chapter.map((v) => [v.verse, v.text])
      );
      const versesByIdIndopak = new Map<number, string>(
        indopakJson.chapter.map((v) => [v.verse, v.text])
      );

      const payload: DynamicSurahData = {
        surahNumber,
        name: `Surah ${surahNumber}`,
        verses: idJson.chapter.map((v) => ({
          number: v.verse,
          textArabicUthmani: versesById.get(v.verse) || "",
          textArabicIndopak: versesByIdIndopak.get(v.verse) || "",
          translationId: v.text,
        })),
        source: "fawazahmed0_static",
      };
      await db?.put("surahs", payload, surahNumber);
      return payload;
    }
  } catch {
    console.error("Tier 3 API unreachable. Serving cached data.");
  }

  if (cached) {
    return { ...cached, source: "indexeddb_cache" };
  }

  throw new Error(`Critical Data Failure: Unable to fetch Surah ${surahNumber}.`);
}
