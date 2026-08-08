import { getSurahMeta, SURAHS } from "@/lib/surahs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { UMMI_JUZ30, UMMI_SOURCE } from "@/lib/ummiAudio";

export const dynamic = "force-static";

function surahLines(): string {
  return SURAHS.map(
    (s) =>
      `- [Surah ${s.nameId}](/reader/${s.number}): ${s.ayahCount} ayat, diturunkan di ${s.revelation} (${s.nameArabic})`
  ).join("\n");
}

function ummiLines(): string {
  return UMMI_JUZ30.map((entry) => {
    const meta = getSurahMeta(entry.surah);
    return `- [Surah ${meta?.nameId ?? entry.surah}](/ummi): ${meta?.ayahCount ?? ""} ayat — murottal anak Metode Ummi (Nada Nahawand)`;
  }).join("\n");
}

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## About

${SITE_NAME} adalah aplikasi progresif (PWA) gratis untuk menghafal Al-Qur'an anak usia 5–15 tahun dan keluarga. Menggabungkan Metode Ummi (Nada Nahawand), pengulangan berjenjang Tikrar, sistem ulangan berjarak FSRS (spaced repetition), serta mushaf dwi-skrip Uthmani dan IndoPak dengan terjemahan bahasa Indonesia.

Akses cepat: ${SITE_URL}

## Key Features

- **Murottal Per Ayat**: pemutar audio per-ayat (qari standar) dengan jeda hening otomatis untuk latihan menirukan.
- **Metode Ummi Anak (Juz 30)**: modul khusus murottal anak dengan nada Metode Ummi/Nahawand (suara anak-anak), pemutar sendiri, A-B loop, dan lanjut otomatis antar surah.
- **Tikrar (N×M)**: pengulangan berjenjang — N kali per ayat, M kali per blok/halaman.
- **FSRS**: penjadwalan ulangan Sabaq, Sabqi & Manzil berbasis stabilitas memori.
- **Mushaf Dwi-Skrip**: teks Uthmani & IndoPak standar Kemenag RI dengan terjemahan Indonesia.
- **Pemantauan Orang Tua/Guru**: dashboard analitik progres hafalan anak secara real-time.
- **PWA Offline**: berjalan tanpa internet setelah surah diunduh, dengan verifikasi bacaan berbasis WebGPU di perangkat.

## Key Pages

- [Beranda](/) — pengenalan platform dan metode.
- [Pilih Surah](/reader) — daftar seluruh 114 surah untuk dibaca & dihafal.
- [Metode Ummi — Murottal Anak Juz 30](/ummi) — modul khusus murottal anak (Nada Nahawand).
- [Cari Ayat](/cari) — pencarian ayat dengan teks Arab/lemma/akar kata (API: /api/quran/search).
- [Mutashabihat — Ayat Mirip](/mutashabihat) — bandingkan ayat mirip dengan penyorotan perbedaan kata.
- [Kisah dalam Al-Qur'an](/kisah) — peta interaktif kisah para nabi dengan rujukan ayat.
- [Baca per Juz](/juz) & [per Halaman](/halaman) — mode baca mushaf.
- [Artikel & Amalan](/artikel) — keutamaan amalan & ayat pilihan (Ayat Kursi, Seribu Dinar, dll).
- [Amalan Rutin](/amalan) — Yasin & Tahlil, Al-Kahfi, Al-Waqi'ah, Al-Mulk.
- [Nilai Akhlak](/akhlak) — ayat pilihan berdasarkan nilai karakter.
- [Masuk](/auth/login) & [Daftar](/auth/signup) — akun orang tua/guru/anak.

## Surah (114)

${surahLines()}

## Metode Ummi — Murottal Anak Juz 30 (37 surah)

${ummiLines()}

Sumber audio modul Metode Ummi: ${UMMI_SOURCE.creator} · ${UMMI_SOURCE.url} (${UMMI_SOURCE.year}).

## Halaman yang tidak perlu diindeks LLM

- [/dashboard](/dashboard) — area pribadi orang tua/guru.
- [/deck](/deck) — jadwal hafalan pribadi.
- [/verify](/verify) — verifikasi bacaan pribadi.
- [/quest](/quest) — progres quest hafalan pribadi.

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
