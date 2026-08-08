"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function TafsirAiChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credit, setCredit] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await supabase
          .from("user_credits")
          .select("balance")
          .maybeSingle();
        setCredit((data as { balance?: number } | null)?.balance ?? 0);
      } catch {
        // abaikan
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/ai/tafsir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const json = (await res.json()) as {
        answer?: string;
        citations?: string[];
        error?: string;
      };
      if (!res.ok || json.error) {
        setError(json.error ?? "Terjadi kesalahan.");
      } else {
        setAnswer(json.answer ?? "");
        setCitations(json.citations ?? []);
        setCredit((c) => (c === null ? c : Math.max(0, c - 1)));
      }
    } catch {
      setError("Gagal menghubungi layanan AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {credit !== null && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sisa kredit AI:{" "}
          <span className="font-bold text-emerald-600">{credit}</span> · 1
          pertanyaan = 1 kredit
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Tanyakan makna ayat, asbabun nuzul, atau tema…"
          className="h-11 flex-1"
          aria-label="Pertanyaan tafsir"
        />
        <Button type="submit" disabled={loading} className="h-11">
          {loading ? "Menganalisis…" : "Tanya"}
        </Button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {answer && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Jawaban
              </span>
              {citations.length > 0 && (
                <span className="text-xs text-slate-400">
                  Rujukan: {citations.join(", ")}
                </span>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
              {answer}
            </p>
            {citations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {citations.map((c) => {
                  const [s, a] = c.split(":");
                  return (
                    <Link
                      key={c}
                      href={`/reader/${s}#ayah-${a}`}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-emerald-300"
                    >
                      Buka {c}
                    </Link>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Dijawab oleh AI berdasarkan Tafsir Kemenag RI &amp; teks Quran;
              mohon cek silang dengan sumber resmi.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
