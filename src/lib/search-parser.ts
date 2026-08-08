export type ParsedQuery =
  | { type: "surah_verse"; surah: number; verse: number }
  | { type: "surah"; surah: number }
  | { type: "juz"; juz: number }
  | { type: "page"; page: number }
  | { type: "keyword"; keyword: string };

const SURAH_ALIASES: Record<string, number> = {
  fatihah: 1, "al fatihah": 1,
  baqarah: 2, "al baqarah": 2,
  "ali imran": 3, imran: 3,
  nisa: 4, "an nisa": 4, "an-nisa": 4,
  maidah: 5, "al maidah": 5,
  "al anam": 6, anam: 6,
  "al araf": 7, araf: 7,
  "al anfal": 8, anfal: 8,
  "at taubah": 9, taubah: 9,
  yunus: 10, hud: 11, yusuf: 12,
  "ar ra'd": 13, ibrahim: 14, "al hijr": 15, "an nahl": 16, nahl: 16,
  "al isra": 17, isra: 17,
  kahfi: 18, "al kahfi": 18,
  maryam: 19, thaha: 20, "tha ha": 20,
  "al anbiya": 21, "al hajj": 22,
  "al mu'minun": 23, "an nur": 24,
  "al furqan": 25, "asy syu'ara": 26, "asy syuara": 26, "an naml": 27,
  "al qasas": 28, "al ankabut": 29, "ar rum": 30, luqman: 31, "as sajdah": 32,
  "al ahzab": 33, "saba": 34, "fatir": 35, yasin: 36, "yaasiin": 36,
  "as saffat": 37, sad: 38, "az zumar": 39, ghafir: 40, fussilat: 41,
  "asy syura": 42, "az zukhruf": 43, "ad dukhan": 44, "al jathiyah": 45,
  "al ahqaf": 46, muhammad: 47, "al fath": 48, "al hujurat": 49, qaf: 50,
  "adz dzariyat": 51, "at tur": 52, "an najm": 53, "al qamar": 54,
  rahman: 55, "ar rahman": 55, "al waqiah": 56, waqiah: 56, "al hadid": 57,
  "al mujadilah": 58, "al hasyr": 59, "al mumtahanah": 60, "as saff": 61,
  "al jumu'ah": 62, "al munafiqun": 63, "at taghabun": 64, "at talaq": 65,
  "at tahrim": 66, mulk: 67, "al mulk": 67, "al qalam": 68, "al haqqah": 69,
  "al ma'arij": 70, nuh: 71, "al jinn": 72, "al muzzammil": 73, "al muddaththir": 74,
  "al qiyamah": 75, "al insan": 76, "al mursalat": 77, "an naba": 78, "an naba'": 78,
  "an nazi'at": 79, "abasa": 80, "at takwir": 81, "al infitar": 82, "al infithaar": 82,
  "al mutaffifin": 83, "al insyiqaq": 84, "al buruj": 85, "at tariq": 86,
  "al a'la": 87, "al ghasyiyah": 88, "al fajr": 89, "al balad": 90,
  "asy syams": 91, "al lail": 92, "ad duha": 93, "asy syarh": 94,
  "at tin": 95, "al alaq": 96, "al qadr": 97, "al bayyinah": 98,
  "az zalzalah": 99, "al adiyat": 100, "al qari'ah": 101, "at takathur": 102,
  "al asr": 103, "al humazah": 104, "al fil": 105, quraisy: 106,
  "al ma'un": 107, "al kautsar": 108, "al kafirun": 109, "an nasr": 110,
  "al lahab": 111, "al ikhlas": 112, ikhlas: 112, "al falaq": 113, "an nas": 114,
};

function resolveAlias(name: string): number | undefined {
  const clean = name.trim().toLowerCase().replace(/\s+/g, " ");
  return SURAH_ALIASES[clean];
}

export function parseSmartQuery(input: string): ParsedQuery {
  const q = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return { type: "keyword", keyword: q };

  const juz = q.match(/^juz\s*(\d{1,2})$/);
  if (juz) {
    const n = Number(juz[1]);
    if (n >= 1 && n <= 30) return { type: "juz", juz: n };
  }

  const page = q.match(/^(?:halaman|hal)\s*(\d{1,3})$/);
  if (page) {
    const n = Number(page[1]);
    if (n >= 1 && n <= 604) return { type: "page", page: n };
  }

  const colon = q.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if (colon) {
    const s = Number(colon[1]);
    const v = Number(colon[2]);
    if (s >= 1 && s <= 114 && v >= 1) return { type: "surah_verse", surah: s, verse: v };
  }

  // "qs muhammad 38" / "surat yasin" / "al baqarah 286"
  const named = q.match(/^(?:qs|surat|surah)\s+(.+)$/);
  if (named) {
    const body = named[1];
    const verseMatch = body.match(/^(.*?)\s*(?:ayat)?\s*(\d{1,3})$/);
    const name = verseMatch ? verseMatch[1].trim() : body;
    const s = resolveAlias(name);
    if (s) {
      const v = verseMatch && verseMatch[2] ? Number(verseMatch[2]) : 0;
      if (v >= 1) return { type: "surah_verse", surah: s, verse: v };
      return { type: "surah", surah: s };
    }
  }

  // named surah with optional verse (no prefix)
  const bare = q.match(/^(.*?)\s*(?:ayat)\s*(\d{1,3})$/);
  if (bare) {
    const s = resolveAlias(bare[1]);
    if (s) {
      const v = Number(bare[2]);
      if (v >= 1) return { type: "surah_verse", surah: s, verse: v };
    }
  }

  // "al baqarah 286" / "yasin"
  for (const [key, num] of Object.entries(SURAH_ALIASES)) {
    if (q === key) return { type: "surah", surah: num };
    const prefix = key + " ";
    if (q.startsWith(prefix)) {
      const rest = q.slice(prefix.length).replace("ayat ", "");
      if (/^\d{1,3}$/.test(rest)) {
        const v = Number(rest);
        if (v >= 1) return { type: "surah_verse", surah: num, verse: v };
      }
    }
  }

  return { type: "keyword", keyword: q };
}
