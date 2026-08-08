import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { arabicSkeleton, isArabicText, normalizeArabic } from "@/lib/arabicNlp";
import { quranMcpCall } from "@/lib/quranMcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Verse {
  s: number;
  a: number;
  u: string;
  t: string;
  n: string;
}

let indexCache: Verse[] | null = null;

function loadIndex(): Verse[] {
  if (!indexCache) {
    const p = join(process.cwd(), "public/data/quran-index.json");
    indexCache = (JSON.parse(readFileSync(p, "utf8")) as { verses: Verse[] }).verses;
  }
  return indexCache;
}

/** Cari ayat yang memuat kata dengan kerangka konsonan mengandung akar kata. */
function findVersesByRootLocal(root: string, limit: number): Verse[] {
  const verses = loadIndex();
  const rootNorm = arabicSkeleton(normalizeArabic(root));
  if (rootNorm.length < 3) return [];
  const matches: Verse[] = [];
  for (const v of verses) {
    const words = v.u.split(" ");
    const hit = words.some((w) =>
      arabicSkeleton(normalizeArabic(w)).includes(rootNorm)
    );
    if (hit) {
      matches.push(v);
      if (matches.length >= limit) break;
    }
  }
  return matches;
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("limit") ?? 20) || 20, 1),
    50
  );

  if (!q) {
    return NextResponse.json({ error: "Parameter q wajib diisi." }, { status: 400 });
  }

  const isArabic = isArabicText(q);

  try {
    const local = findVersesByRootLocal(q, limit);
    if (local.length > 0) {
      return NextResponse.json({
        results: local.map((v) => ({
          sura_id: v.s,
          aya_id: v.a,
          uthmani: v.u,
          translationId: v.t,
          surahName: v.n,
        })),
        total: local.length,
        source: "local-root",
      });
    }

    // Fallback MCP (best-effort)
    let results: { sura_id: number; aya_id: number; uthmani: string }[] = [];
    if (isArabic) {
      try {
        const raw = (await quranMcpCall("find_verses_by_root", {
          root: q,
          limit,
        })) as { results?: { sura_id?: number; aya_id?: number; uthmani?: string }[] };
        results = (raw.results ?? []).map((r) => ({
          sura_id: r.sura_id ?? 0,
          aya_id: r.aya_id ?? 0,
          uthmani: r.uthmani ?? "",
        }));
      } catch {
        results = [];
      }
    }

    return NextResponse.json({
      results,
      total: results.length,
      source: "mcp-root",
    });
  } catch (err) {
    console.error("Root search error:", err);
    return NextResponse.json({ error: "Gagal mencari akar kata." }, { status: 500 });
  }
}
