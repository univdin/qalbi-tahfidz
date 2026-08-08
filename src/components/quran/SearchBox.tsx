"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
  sura_id: number;
  aya_id: number;
  aya_id_display: string;
  uthmani: string;
  sura_name: string;
  sura_name_romanization: string;
}

interface SearchResponse {
  results?: SearchResult[];
  pagination?: { totalResults: number };
  error?: string;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
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
      const res = await fetch(`/api/quran/search?q=${encodeURIComponent(q)}&limit=20`);
      const json = (await res.json()) as SearchResponse;
      if (!res.ok || json.error) {
        setError(json.error ?? "Pencarian gagal.");
        setResults([]);
        setTotal(0);
      } else {
        setResults(json.results ?? []);
        setTotal(json.pagination?.totalResults ?? 0);
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
    <div className="flex w-full max-w-3xl flex-col gap-6">
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
        {results.map((r) => (
          <Link key={`${r.sura_id}-${r.aya_id}`} href={`/reader/${r.sura_id}#ayah-${r.aya_id}`}>
            <Card className="transition-colors hover:border-emerald-400">
              <CardContent className="flex flex-col gap-2 p-4">
                <p className="text-xs font-semibold text-emerald-600">
                  {r.sura_name_romanization} ({r.sura_name}) · Ayat {r.aya_id_display}
                </p>
                <p className="font-arabic text-xl leading-relaxed text-slate-900 dark:text-slate-50">
                  {r.uthmani}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
