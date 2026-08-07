export const SITE_NAME = "QalbiTahfidz";
export const SITE_TAGLINE = "Platform hafalan Al-Qur'an untuk anak & keluarga";
export const SITE_DESCRIPTION =
  "Web app (PWA) hafalan Al-Qur'an: audio per ayat dengan Metode Ummi/Nahawand, pengulangan Tikrar, penjadwalan ulangan FSRS, mushaf dwi-skrip Uthmani/IndoPak, dan dashboard pantauan untuk orang tua & guru.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quran.ilmify.id";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl("/icon-512.png");
