"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Range } from "@/data/quranBounds";
import { getSurahMeta, proxyAudioUrl } from "@/lib/surahs";
import { fetchRangesText } from "@/lib/quranReading";
import type { DynamicSurahData } from "@/services/quranDataService";

interface Props {
  ranges: Range[];
}

export function ReadingMode({ ranges }: Props) {
  const [data, setData] = useState<Record<number, DynamicSurahData>>({});
  const [loadedKey, setLoadedKey] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentKey = ranges.map((r) => `${r.s}:${r.start}-${r.end}`).join("|");

  useEffect(() => {
    let cancelled = false;
    fetchRangesText(ranges)
      .then((m) => {
        if (cancelled) return;
        setData(m);
        setLoadedKey(currentKey);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ranges, currentKey]);

  const loading = loadedKey !== currentKey;

  const togglePlay = (s: number, a: number) => {
    const key = `${s}-${a}`;
    if (playing === key) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(proxyAudioUrl("Alafasy_128kbps", s, a));
    audioRef.current = audio;
    audio.onended = () => setPlaying(null);
    void audio.play();
    setPlaying(key);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="text-sm text-slate-500">Memuat teks…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {ranges.map((r, ri) => {
        const meta = getSurahMeta(r.s);
        const verses =
          data[r.s]?.verses.filter(
            (v) => v.number >= r.start && v.number <= r.end
          ) ?? [];
        return (
          <section key={ri} className="flex flex-col gap-3">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-arabic text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {meta?.nameArabic}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {meta?.nameId} · Ayat {r.start}–{r.end}
                </p>
              </div>
              <Link
                href={`/reader/${r.s}`}
                className="text-sm font-semibold text-emerald-600 hover:underline"
              >
                Buka di Reader ↗
              </Link>
            </header>
            {verses.map((v) => (
              <div
                key={v.number}
                id={`ayah-${v.number}`}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    {v.number}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePlay(r.s, v.number)}
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                    aria-label={`Putar ayat ${v.number}`}
                  >
                    {playing === `${r.s}-${v.number}` ? "⏹ Berhenti" : "▶ Putar"}
                  </button>
                </div>
                <p
                  dir="rtl"
                  className="font-arabic text-3xl leading-loose text-slate-900 dark:text-slate-50"
                >
                  {v.textArabicUthmani}
                </p>
                {v.translationId && (
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {v.translationId}
                  </p>
                )}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
