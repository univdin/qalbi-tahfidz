import { readFileSync } from "node:fs";
import path from "node:path";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { SURAHS } from "@/lib/surahs";

export const dynamic = "force-static";

// llms-full.txt — dump lengkap 6.236 ayat (Araba + terjemahan Indonesia).
// Membaca index lokal (public/data/quran-index.json) saat build (force-static).
interface IndexVerse {
  s: number;
  a: number;
  u: string;
  t: string;
}

function loadVerses(): IndexVerse[] {
  const file = path.join(process.cwd(), "public", "data", "quran-index.json");
  const data = JSON.parse(readFileSync(file, "utf8")) as { verses: IndexVerse[] };
  return data.verses;
}

export function GET() {
  const verses = loadVerses();
  const bySurah = new Map<number, IndexVerse[]>();
  for (const v of verses) {
    const list = bySurah.get(v.s) ?? [];
    list.push(v);
    bySurah.set(v.s, list);
  }

  const header = `# ${SITE_NAME} — Full Text (llms-full.txt)

> ${SITE_DESCRIPTION}

Dataset lengkap mushaf dwi-skrip (Uthmani) + terjemahan bahasa Indonesia untuk 6.236 ayat.
Format per ayat: \`{surah}:{ayah} | Arab | Terjemahan\`. URL: ${SITE_URL}/reader/{surah}/{ayah}.
Sumber: Quran.com API / gadingnst / fawazahmed0/quran-api. Lisensi teks: public domain (teks Al-Qur'an).
`;

  const body = SURAHS.map((meta) => {
    const ayahLines = (bySurah.get(meta.number) ?? [])
      .sort((a, b) => a.a - b.a)
      .map((v) => `${meta.number}:${v.a} | ${v.u} | ${v.t}`)
      .join("\n");
    return `## ${meta.number}. Surah ${meta.nameId} (${meta.nameArabic}) — ${meta.revelation}, ${meta.ayahCount} ayat

${ayahLines}`;
  }).join("\n\n");

  return new Response(`${header}\n\n${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
