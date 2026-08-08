import { NextRequest, NextResponse } from "next/server";
import { quranMcpCall } from "@/lib/quranMcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("limit") ?? 20) || 20, 1),
    50
  );

  if (!q) {
    return NextResponse.json({ error: "Parameter q (query) wajib diisi." }, { status: 400 });
  }

  const cacheKey = `${q}::${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const data = await quranMcpCall("search", { query: q, limit });
    cache.set(cacheKey, { data, expiresAt: Date.now() + TTL_MS });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mencari ayat." },
      { status: 502 }
    );
  }
}
