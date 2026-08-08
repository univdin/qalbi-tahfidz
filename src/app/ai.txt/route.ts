import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## What this site is

Aplikasi progresif (PWA) gratis untuk menghafal Al-Qur'an anak usia 5–15 tahun dan keluarga: murottal per ayat, mushaf dwi-skrip Uthmani/IndoPak, terjemahan Indonesia, tafsir Kemenag, pengulangan berjenjang Tikrar, penjadwalan ulangan FSRS, modul khusus Metode Ummi (Nada Nahawand, Juz 30), dan dashboard pemantauan orang tua/guru.

- Web: ${SITE_URL}
- Repositori: https://github.com/univdin/qalbi-tahfidz

## Key features

- Murottal per ayat (qari standar) dengan jeda hening untuk latihan menirukan.
- Modul Metode Ummi anak (Nada Nahawand, suara anak) untuk Juz 30.
- Tikrar N×M: pengulangan berjenjang per ayat & per blok.
- FSRS: penjadwalan ulangan Sabaq, Sabqi & Manzil berbasis stabilitas memori.
- Mushaf dwi-skrip Uthmani & IndoPak (Kemenag RI) + terjemahan Indonesia.
- Tafsir Kemenag per ayat + Tanya Tafsir AI.
- PWA offline setelah surah diunduh; verifikasi bacaan berbasis WebGPU.

## Important pages

- / — beranda & pengenalan platform
- /reader — daftar 114 surah
- /reader/{surah}/{ayat} — teks, terjemahan, tafsir, dan audio per ayat
- /juz & /halaman — mode baca mushaf
- /ummi — murottal anak Juz 30 (Metode Ummi)
- /cari — pencarian ayat (Arab/lemma/akar)
- /mutashabihat — ayat-ayat mirip
- /kisah — kisah para nabi dalam Al-Qur'an
- /artikel — amalan & ayat pilihan (Ayat Kursi, dll.)

## What we DO NOT offer

- Kami TIDAK menjual, membagikan, atau memonetisasi data pribadi anak.
- Kami TIDAK menawarkan konsultasi fatwa atau legal opinion — konten tafsir diambil dari Tafsir Kemenag RI.
- Kami TIDAK mengklaim otoritas qira'ah — audio bersumber dari penyedia pihak ketiga yang dicantumkan.
- Kami TIDAK menyediakan layanan medis, psikologis, atau pendidikan formal berlisensi.
- Aplikasi ini BUKAN pengganti guru tahfidz; verifikasi bacaan berbasis perangkat hanya alat bantu.

## Facts & references

- Teks Arab & terjemahan: Quran.com API, gadingnst, fawazahmed0/quran-api (sumber data terbuka).
- Tafsir: Kemenag RI.
- Metode Ummi: www.ummifoundation.org.
- Audio anak (Metode Ummi, Nada Nahawand): sumber pihak ketiga (lihat halaman /ummi).

## Outlinks

- ${SITE_URL}/llms.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
