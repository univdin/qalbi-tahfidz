export const UMMI_ITEM = "murottal-anak-juz-30-metode-ummi";

export const UMMI_SOURCE = {
  creator: "Muhdayin",
  platform: "archive.org",
  year: "2020",
  item: UMMI_ITEM,
  url: `https://archive.org/details/${UMMI_ITEM}`,
  note: "Murottal anak Juz 30 dengan nada Metode Ummi/Nahawand (suara anak-anak). Lisensi eksplisit tidak dideklarasikan; digunakan dengan atribusi.",
} as const;

/**
 * Token nama file PERSIS dari listing archive.org (diverifikasi 2026-08-08):
 * https://archive.org/metadata/murottal-anak-juz-30-metode-ummi
 * Cakupan: Juz 30 lengkap (surah 78–114), 37 file.
 */
const UMMI_FILE_TOKENS: Record<number, string> = {
  78: "An-Naba",
  79: "An-Naaziaat",
  80: "Abasa",
  81: "At-Takwiir",
  82: "Al-Infithaar",
  83: "Al-Muthaffifiin",
  84: "Al-Insyiqaaq",
  85: "Al-Buruuj",
  86: "Ath-Thariq",
  87: "Al-Alaa",
  88: "Al-Ghasyiyah",
  89: "Al-Fajr",
  90: "Al-Balad",
  91: "Asy-Syams",
  92: "Al-Lail",
  93: "Adh-Dhuha",
  94: "As-Syarh",
  95: "At-Tiin",
  96: "Al-Alaq",
  97: "Al-Qadr",
  98: "Al-Bayyinah",
  99: "Az-Zalzalah",
  100: "Al-Adiyaat",
  101: "Al-Qaariah",
  102: "At-Takaatsur",
  103: "Al-Ashr",
  104: "Al-Humazah",
  105: "Al-Fiil",
  106: "Quraisy",
  107: "Al-Maauun",
  108: "Al-Kautsar",
  109: "Al-Kaafiruun",
  110: "An-Nashr",
  111: "Al-Lahb",
  112: "Al-Ikhlash",
  113: "Al-Falaq",
  114: "An-Naas",
};

export interface UmmiSurahAudio {
  surah: number;
  file: string;
}

export const UMMI_JUZ30: UmmiSurahAudio[] = Object.entries(
  UMMI_FILE_TOKENS
).map(([surah, token]) => ({
  surah: Number(surah),
  file: `Metode-Ummi-${String(surah).padStart(3, "0")}-${token}.mp3`,
}));

export function getUmmiFile(surah: number): string | null {
  return UMMI_JUZ30.find((s) => s.surah === surah)?.file ?? null;
}

export function ummiDownloadUrl(file: string): string {
  return `https://archive.org/download/${UMMI_ITEM}/${file}`;
}

export function ummiAudioUrl(surah: number): string | null {
  const file = getUmmiFile(surah);
  if (!file) return null;
  return `/api/audio/proxy?url=${encodeURIComponent(ummiDownloadUrl(file))}`;
}
