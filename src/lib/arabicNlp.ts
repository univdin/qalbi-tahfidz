/**
 * Arabic NLP utilities (port dari PyArabic — linuxscout/pyarabic).
 * Fungsional: strip tashkeel, normalisasi alif/hamzah, ta marbuta, ya.
 */

export const TASHKEEL_RE = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
export const ARABIC_RE = /[\u0621-\u064A]/;

export function isArabicText(text: string): boolean {
  return ARABIC_RE.test(text);
}

/** Hapus semua harakat (fathah, kasrah, dammah, sukun, tajwid, dll). */
export function stripTashkeel(text: string): string {
  return text.replace(TASHKEEL_RE, "");
}

/** أ إ آ ٱ → ا */
export function normalizeAlif(text: string): string {
  return text.replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627");
}

/** ى (alif maqsurah) → ي */
export function normalizeYa(text: string): string {
  return text.replace(/\u0649/g, "\u064A");
}

/** ة (ta marbuta) → ه */
export function normalizeTaMarbuta(text: string): string {
  return text.replace(/\u0629/g, "\u0647");
}

/** Normalisasi lengkap: strip harakat + alif/hamzah + ya + ta marbuta. */
export function normalizeArabic(text: string): string {
  return normalizeTaMarbuta(normalizeYa(normalizeAlif(stripTashkeel(text))));
}

/** Buang alif untuk "kerangka" konsonan (fallback pencarian). */
export function arabicSkeleton(text: string): string {
  return text.replace(/\u0627/g, "");
}

/** Ambil karakter Arab pertama dari sebuah kata. */
export function firstArabicChar(word: string): string {
  const clean = stripTashkeel(word);
  for (const ch of clean) {
    if (ARABIC_RE.test(ch)) return ch;
  }
  return "";
}
