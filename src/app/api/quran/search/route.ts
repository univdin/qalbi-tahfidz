import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Verse {
  s: number;
  a: number;
  u: string;
  t: string;
  n: string;
}

const TASH = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

function normalizeArabic(t: string): string {
  return t
    .replace(TASH, "")
    .replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0629/g, "\u0647");
}

let indexCache: Verse[] | null = null;

function loadIndex(): Verse[] {
  if (!indexCache) {
    const p = join(process.cwd(), "public/data/quran-index.json");
    const raw = readFileSync(p, "utf8");
    indexCache = (JSON.parse(raw) as { verses: Verse[] }).verses;
  }
  return indexCache;
}

interface Match {
  verse: Verse;
  score: number;
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("limit") ?? 20) || 20, 1),
    50
  );

  if (!q) {
    return NextResponse.json({ error: "Parameter q (query) wajib diisi." }, { status: 400 });
  }

  try {
    const verses = loadIndex();
    const lowerQ = q.toLowerCase();
    const hasArabic = /[\u0621-\u064A]/.test(q);
    const qNorm = normalizeArabic(q);

    const matches: Match[] = [];
    for (const v of verses) {
      let score = 0;
      if (hasArabic && qNorm) {
        if (v.u.includes(qNorm)) score = v.u === qNorm ? 3 : 2;
      }
      if (lowerQ) {
        const vt = v.t.toLowerCase();
        if (vt.includes(lowerQ)) {
          score = Math.max(score, vt === lowerQ ? 3 : 1);
        }
      }
      if (score > 0) matches.push({ verse: v, score });
    }

    // Fallback "kerangka" (buang alif di kedua sisi) agar ا pada teks Uthmani
    // (mis. dagger alef) tetap cocok dengan ejaan pengguna (mis. القيامة).
    if (matches.length === 0 && hasArabic && qNorm) {
      const qSkel = qNorm.replace(/\u0627/g, "");
      for (const v of verses) {
        if (qSkel && v.u.replace(/\u0627/g, "").includes(qSkel)) {
          matches.push({ verse: v, score: 1 });
        }
      }
    }

    matches.sort((a, b) => b.score - a.score);
    const top = matches.slice(0, limit);

    return NextResponse.json({
      results: top.map((m) => ({
        sura_id: m.verse.s,
        aya_id: m.verse.a,
        uthmani: m.verse.u,
        translationId: m.verse.t,
        surahName: m.verse.n,
      })),
      total: matches.length,
      source: "local",
    });
  } catch (err) {
    console.error("Search index error:", err);
    return NextResponse.json({ error: "Gagal memuat indeks pencarian." }, { status: 500 });
  }
}
