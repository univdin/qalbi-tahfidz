export const SITE_NAME = "QalbiTahfidz";
export const SITE_TAGLINE = "Hafalan Al-Qur'an untuk Keluarga Indonesia";
export const SITE_DESCRIPTION =
  "Aplikasi PWA hafalan Al-Qur'an anak & keluarga: Metode Ummi (Nada Nahawand), pengulangan berjenjang Tikrar, sistem ulangan berjarak FSRS, dan mushaf dwi-skrip Uthmani/IndoPak.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quran.ilmify.id";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl("/icon-512.png");
