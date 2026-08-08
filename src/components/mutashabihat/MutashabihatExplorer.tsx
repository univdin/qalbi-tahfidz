"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  getMutashabihatData,
  verseRefLabel,
  type MutashabihatData,
  type MutashabihatGroup,
} from "@/lib/mutashabihat";
import { fetchDynamicSurah } from "@/services/quranDataService";
import { getSurahMeta } from "@/lib/surahs";
import { DiffViewer } from "@/components/mutashabihat/DiffViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TextStore = Map<string, string>;

async function loadTexts(surahs: number[]): Promise<TextStore> {
  const store = new Map<string, string>();
  const unique = [...new Set(surahs)];
  await Promise.all(
    unique.map(async (s) => {
      try {
        const data = await fetchDynamicSurah(s);
        for (const v of data.verses) {
          store.set(`${s}:${v.number}`, v.textArabicUthmani);
        }
      } catch {
        // biarkan kosong
      }
    })
  );
  return store;
}

function refText(ref: { s: number; a1: number; a2: number }, store: TextStore): string {
  const parts: string[] = [];
  for (let a = ref.a1; a <= ref.a2; a++) {
    const t = store.get(`${ref.s}:${a}`);
    if (t) parts.push(t);
  }
  return parts.join(" ");
}

const JUZ_OPTIONS = Array.from({ length: 30 }, (_, i) => i + 1);

export function MutashabihatExplorer() {
  const [data, setData] = useState<MutashabihatData | null>(null);
  const [juz, setJuz] = useState(30);
  const [selected, setSelected] = useState<number | null>(null);
  const [mutIndex, setMutIndex] = useState(0);
  const [textStore, setTextStore] = useState<TextStore | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMutashabihatData().then(setData).catch(() => {});
  }, []);

  const groups = useMemo(
    () => (data ? data.juzs[String(juz)] ?? [] : []),
    [data, juz]
  );

  const detailRef = useRef<HTMLDivElement | null>(null);

  const loadGroup = useCallback(
    async (group: MutashabihatGroup, index: number) => {
      setSelected(index);
      setMutIndex(0);
      setLoading(true);
      const surahs = [group.src.s, ...group.muts.map((m) => m.s)];
      const store = await loadTexts(surahs);
      setTextStore(store);
      setLoading(false);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    },
    []
  );

  const active = selected !== null ? groups[selected] : null;
  const mut = active ? active.muts[Math.min(mutIndex, active.muts.length - 1)] : null;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Juz:
        </label>
        <select
          value={juz}
          onChange={(e) => {
            setJuz(Number(e.target.value));
            setSelected(null);
            setTextStore(null);
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          {JUZ_OPTIONS.map((n) => (
            <option key={n} value={n}>
              Juz {n}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-500">
          {groups.length} kelompok lafaz serupa di Juz {juz}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {groups.map((g, idx) => {
          const meta = getSurahMeta(g.src.s);
          return (
            <button
              key={`${g.src.s}-${g.src.a1}-${idx}`}
              type="button"
              onClick={() => loadGroup(g, idx)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                selected === idx
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                  : "border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/60"
              }`}
            >
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {meta?.nameId ?? `Surah ${g.src.s}`} · {verseRefLabel(g.src)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {g.muts.length} lafaz serupa
              </p>
            </button>
          );
        })}
      </div>

      {selected !== null && active && (
        <Card ref={detailRef}>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-slate-50">
                  Ayat {verseRefLabel(active.src)} dan ayat mirip
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kata yang berbeda disorot kuning. {active.ctx > 0 ? `Konteks: ${active.ctx} ayat.` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {active.muts.map((m, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={i === mutIndex ? "default" : "outline"}
                    onClick={() => setMutIndex(i)}
                  >
                    {verseRefLabel(m)}
                  </Button>
                ))}
              </div>
            </div>

            {loading || !textStore ? (
              <p className="text-sm text-slate-500">Memuat teks ayat…</p>
            ) : mut ? (
              <>
                <DiffViewer
                  aText={refText(active.src, textStore)}
                  bText={refText(mut, textStore)}
                  aLabel={verseRefLabel(active.src)}
                  bLabel={verseRefLabel(mut)}
                />
                <div className="flex gap-2">
                  <Link
                    href={`/reader/${active.src.s}#ayah-${active.src.a1}`}
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    Buka di Reader
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Teks ayat belum tersedia. Coba muat ulang.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
