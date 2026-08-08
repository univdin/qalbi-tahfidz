"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getSurahMeta } from "@/lib/surahs";

interface SearchResult {
  sura_id: number;
  aya_id: number;
  uthmani: string;
  translationId?: string;
}

interface SearchResponse {
  results?: SearchResult[];
  error?: string;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"teks" | "akar">("teks");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const endpoint = mode === "akar" ? "/api/quran/root" : "/api/quran/search";
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(q)}&limit=20`);
      const json = (await res.json()) as SearchResponse;
      if (!res.ok || json.error) {
        setError(json.error ?? "Pencarian gagal.");
        setResults([]);
        setTotal(0);
      } else {
        setResults(json.results ?? []);
        setTotal(json.results?.length ?? 0);
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {(
          [
            ["teks", "Cari Teks"],
            ["akar", "Cari Akar Kata"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari ayat… mis. الرحمن / ar-rahman"
          className="h-11 flex-1"
          aria-label="Pencarian Al-Qur'an"
        />
        <Button type="submit" disabled={loading} className="h-11">
          {loading ? "Mencari…" : "Cari"}
        </Button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {searched && !loading && !error && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {total > 0 ? `${total} hasil untuk "${query}"` : `Tidak ada hasil untuk "${query}".`}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {results.map((r) => {
          const meta = getSurahMeta(r.sura_id);
          return (
            <Link key={`${r.sura_id}-${r.aya_id}`} href={`/reader/${r.sura_id}#ayah-${r.aya_id}`}>
              <Card className="transition-colors hover:border-emerald-400">
                <CardContent className="flex flex-col gap-2 p-4">
                  <p className="text-xs font-semibold text-emerald-600">
                    {meta?.nameId ?? `Surah ${r.sura_id}`} ({meta?.nameArabic}) · Ayat{" "}
                    {r.aya_id}
                  </p>
                  <p
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-xl leading-relaxed text-slate-900 dark:text-slate-50"
                  >
                    {r.uthmani}
                  </p>
                  {r.translationId && (
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {r.translationId}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
