import { SURAHS } from "@/lib/surahs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function surahLines(): string {
  return SURAHS.map(
    (s) =>
      `- [Surah ${s.nameId}](/reader/${s.number}): ${s.ayahCount} ayat, diturunkan di ${s.revelation} (${s.nameArabic})`
  ).join("\n");
}

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## About

${SITE_NAME} adalah aplikasi progresif (PWA) gratis untuk menghafal Al-Qur'an anak usia 5–15 tahun dan keluarga. Menggabungkan Metode Ummi (Nada Nahawand), pengulangan berjenjang Tikrar, sistem ulangan berjarak FSRS (spaced repetition), serta mushaf dwi-skrip Uthmani dan IndoPak dengan terjemahan bahasa Indonesia.

Akses cepat: ${SITE_URL}

## Key Features

- **Audio per Ayat**: pemutar audio per-ayat dengan jeda hening otomatis untuk latihan menirukan (Metode Ummi / Nada Nahawand).
- **Tikrar (N×M)**: pengulangan berjenjang — N kali per ayat, M kali per blok/halaman.
- **FSRS**: penjadwalan ulangan Sabaq, Sabqi & Manzil berbasis stabilitas memori.
- **Mushaf Dwi-Skrip**: teks Uthmani & IndoPak standar Kemenag RI dengan terjemahan Indonesia.
- **Pemantauan Orang Tua/Guru**: dashboard analitik progres hafalan anak secara real-time.
- **PWA Offline**: berjalan tanpa internet setelah surah diunduh, dengan verifikasi bacaan berbasis WebGPU di perangkat.

## Key Pages

- [Beranda](/) — pengenalan aplikasi dan metode.
- [Pilih Surah](/reader) — daftar seluruh 114 surah untuk dibaca & dihafal.
- [Masuk](/auth/login) & [Daftar](/auth/signup) — akun orang tua/guru/anak.

## Surah (114)

${surahLines()}

## Halaman yang tidak perlu diindeks LLM

- [/dashboard](/dashboard) — area pribadi orang tua/guru.
- [/deck](/deck) — jadwal hafalan pribadi.
- [/verify](/verify) — verifikasi bacaan pribadi.

## Contact & Repo

- Repositori: https://github.com/univdin/qalbi-tahfidz
- Sumber data Al-Qur'an: Quran.com API, gadingnst, fawazahmed0/quran-api.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
