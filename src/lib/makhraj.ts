export interface MakhrajZone {
  id: string;
  name: string;
  nameAr: string;
  letters: string;
  color: string;
  desc: string;
  x: number;
  y: number;
}

export const MAKHRAJ_ZONES: MakhrajZone[] = [
  { id: "jauf", name: "Al-Jauf", nameAr: "الجوف", letters: "ا و ي (mad)", color: "#14b8a6", desc: "Rongga mulut — tempat keluar huruf mad (ا و ي yang dipanjangkan).", x: 48, y: 40 },
  { id: "aqsal_halq", name: "Aqsal al-Halq", nameAr: "أقصى الحلق", letters: "ء ه", color: "#8b5cf6", desc: "Tenggorokan terdalam (paling dekat dada) — tempat keluar hamzah (ء) dan ha' (ه).", x: 40, y: 78 },
  { id: "wasat_halq", name: "Wasat al-Halq", nameAr: "وسط الحلق", letters: "ع ح", color: "#8b5cf6", desc: "Tengah tenggorokan — tempat keluar 'ain (ع) dan ha (ح).", x: 50, y: 86 },
  { id: "adna_halq", name: "Adna al-Halq", nameAr: "أدنى الحلق", letters: "غ خ", color: "#8b5cf6", desc: "Tenggorokan terdekat ke mulut — tempat keluar ghain (غ) dan kha (خ).", x: 58, y: 84 },
  { id: "aqsal_lisan", name: "Aqsal al-Lisan", nameAr: "أقصى اللسان", letters: "ق", color: "#f59e0b", desc: "Pangkal lidah terdalam berhadapan langit-langit — tempat keluar qaf (ق).", x: 38, y: 52 },
  { id: "aqsal_lisan_kaf", name: "Aqsal al-Lisan (Kaf)", nameAr: "فوق الحنك", letters: "ك", color: "#f59e0b", desc: "Sedikit di depan qaf — tempat keluar kaf (ك).", x: 44, y: 58 },
  { id: "wasat_lisan", name: "Wasat al-Lisan", nameAr: "وسط اللسان", letters: "ج ش ي", color: "#f59e0b", desc: "Tengah lidah berhadapan langit-langit — tempat keluar jim (ج), syin (ش), ya (ي non-mad).", x: 52, y: 56 },
  { id: "hafat_lisan", name: "Hafat al-Lisan", nameAr: "حافة اللسان", letters: "ض", color: "#ec4899", desc: "Tepi lidah (kanan/kiri) menyentuh geraham atas — tempat keluar dhad (ض).", x: 60, y: 52 },
  { id: "adna_hafat", name: "Adna al-Hafat", nameAr: "أدنى الحافة", letters: "ل", color: "#ec4899", desc: "Tepi lidah bagian depan mendekati ujung — tempat keluar lam (ل).", x: 65, y: 56 },
  { id: "taraf_lisan_nun", name: "Taraf al-Lisan", nameAr: "طرف اللسان", letters: "ن", color: "#10b981", desc: "Ujung lidah menyentuh gusi atas — tempat keluar nun (ن).", x: 68, y: 52 },
  { id: "taraf_lisan_ra", name: "Taraf al-Lisan (Ra)", nameAr: "طرف اللسان", letters: "ر", color: "#10b981", desc: "Ujung lidah dekat punggung lidah, sedikit masuk ke belakang — tempat keluar ra (ر).", x: 71, y: 55 },
  { id: "taraf_lisan_ttd", name: "Ujung Lidah + Akar Gigi", nameAr: "أصول الثنايا", letters: "ط د ت", color: "#ef4444", desc: "Ujung lidah menyentuh pangkal gigi seri atas — tempat keluar tha (ط), dal (د), ta (ت).", x: 73, y: 46 },
  { id: "taraf_lisan_ssz", name: "Ujung Lidah + Ujung Gigi", nameAr: "أطراف الثنايا", letters: "ص س ز", color: "#ef4444", desc: "Ujung lidah mendekati ujung gigi seri atas — tempat keluar shad (ص), sin (س), zai (ز).", x: 77, y: 42 },
  { id: "ras_lisan", name: "Ras al-Lisan", nameAr: "رأس اللسان", letters: "ظ ذ ث", color: "#ef4444", desc: "Kepala lidah menyentuh ujung gigi seri atas — tempat keluar zha (ظ), dzal (ذ), tsa (ث).", x: 80, y: 38 },
  { id: "batin_shafah", name: "Batin al-Shafah", nameAr: "باطن الشفة", letters: "ف", color: "#3b82f6", desc: "Dalam bibir bawah menyentuh ujung gigi seri atas — tempat keluar fa (ف).", x: 87, y: 40 },
  { id: "shafatain", name: "Al-Shafatain", nameAr: "الشفتان", letters: "ب م و", color: "#3b82f6", desc: "Kedua bibir — tempat keluar ba (ب), mim (م), wau (و non-mad).", x: 91, y: 46 },
  { id: "khayshum", name: "Al-Khayshum", nameAr: "الخيشوم", letters: "نّ مّ (ghunnah)", color: "#64748b", desc: "Rongga hidung — tempat keluar dengung ghunnah (nun/meem bertasydid).", x: 63, y: 14 },
];

const LETTER_ZONE: Record<string, string> = {
  ا: "jauf", و: "jauf", ي: "jauf",
  ء: "aqsal_halq", ه: "aqsal_halq",
  ع: "wasat_halq", ح: "wasat_halq",
  غ: "adna_halq", خ: "adna_halq",
  ق: "aqsal_lisan", ك: "aqsal_lisan_kaf",
  ج: "wasat_lisan", ش: "wasat_lisan",
  ض: "hafat_lisan", ل: "adna_hafat",
  ن: "taraf_lisan_nun", ر: "taraf_lisan_ra",
  ط: "taraf_lisan_ttd", د: "taraf_lisan_ttd", ت: "taraf_lisan_ttd",
  ص: "taraf_lisan_ssz", س: "taraf_lisan_ssz", ز: "taraf_lisan_ssz",
  ظ: "ras_lisan", ذ: "ras_lisan", ث: "ras_lisan",
  ف: "batin_shafah",
  ب: "shafatain", م: "shafatain",
};

export function getZoneForLetter(char: string): MakhrajZone | null {
  if (!char) return null;
  const zoneId = LETTER_ZONE[char];
  if (!zoneId) return null;
  return MAKHRAJ_ZONES.find((z) => z.id === zoneId) ?? null;
}

export function firstArabicChar(word: string): string {
  const tashkeel = /[\u064B-\u065F\u0670\u0640]/g;
  const clean = word.replace(tashkeel, "");
  for (const ch of clean) {
    if (/[\u0621-\u063A\u0641-\u064A]/.test(ch)) return ch;
  }
  return "";
}
