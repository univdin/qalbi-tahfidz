"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { fetchDynamicSurah, type DynamicSurahData } from "@/services/quranDataService";
import { useAudioStore } from "@/store/useAudioStore";
import {
  RECITERS,
  getSurahMeta,
  proxyAudioUrl,
} from "@/lib/surahs";
import { WordMaskingContainer } from "@/components/quran/WordMaskingContainer";
import { TajweedText } from "@/components/quran/TajweedText";
import { TajweedLegend } from "@/components/quran/TajweedLegend";
import { MakhrajPopup } from "@/components/quran/MakhrajPopup";
import { AyahAudioEngine } from "@/components/quran/AyahAudioEngine";
import { RecitationRecorder } from "@/components/quran/RecitationRecorder";
import { BookmarkButton } from "@/components/quran/BookmarkButton";
import { useLastRead } from "@/hooks/useLastRead";
import {
  fetchTanzilUthmani,
  getSurahTajweed,
  getTajweedData,
  type TajweedRange,
} from "@/lib/tajweed";
import { firstArabicChar, getZoneForLetter, type MakhrajZone } from "@/lib/makhraj";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, Play, Square, RotateCcw, Palette } from "lucide-react";

const PERSONA_LABEL = {
  early_child: "Balita (3–5 th)",
  junior: "Junior (6–9 th)",
  teen_adult: "Remaja/Dewasa (10+)",
} as const;

const MASKING_LABEL = {
  full: "Teks penuh",
  "first-letter": "Petunjuk huruf awal",
  hidden: "Tersembunyi",
} as const;

interface SurahReaderProps {
  surahNumber: number;
}

export const SurahReader: React.FC<SurahReaderProps> = ({ surahNumber }) => {
  const [data, setData] = useState<DynamicSurahData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tajweedEnabled, setTajweedEnabled] = useState(false);
  const [tajweedState, setTajweedState] = useState<{
    surah: number;
    map: Map<number, TajweedRange[]>;
    tanzil: Map<number, string>;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [makhrajZone, setMakhrajZone] = useState<MakhrajZone | null>(null);
  const { saveLastRead } = useLastRead();
  const savedReadRef = useRef<number | null>(null);

  const openMakhraj = (char: string) => {
    setMakhrajZone(getZoneForLetter(char));
  };

  useEffect(() => {
    if (isLoaded && savedReadRef.current !== surahNumber) {
      savedReadRef.current = surahNumber;
      void saveLastRead(surahNumber, 1);
    }
  }, [isLoaded, surahNumber, saveLastRead]);

  const {
    isPlaying,
    repeatPerAyah,
    delayRatio,
    currentAyahIndex,
    selectedReciter,
    agePersona,
    maskingMode,
    preferredScript,
    targetDailyVerses,
    setAudioState,
    setPersonalization,
    nextAyah,
  } = useAudioStore();

  const surahMeta = getSurahMeta(surahNumber);

  useEffect(() => {
    let cancelled = false;
    fetchDynamicSurah(surahNumber)
      .then((surah) => {
        if (cancelled) return;
        setData(surah);
        setIsLoaded(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Gagal memuat surah");
        setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  const totalAyat = data?.verses.length ?? surahMeta?.ayahCount ?? 0;

  useEffect(() => {
    let cancelled = false;
    if (!tajweedEnabled) return;
    Promise.all([getTajweedData(), fetchTanzilUthmani(surahNumber)])
      .then(([tajweed, tanzil]) => {
        if (cancelled) return;
        setTajweedState({
          surah: surahNumber,
          map: getSurahTajweed(surahNumber, tajweed),
          tanzil,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tajweedEnabled, surahNumber]);

  const handleStart = useCallback(() => {
    setAudioState({ isPlaying: true, currentAyahIndex: 0, currentAyahRepeat: 0, isSilenceGap: false });
  }, [setAudioState]);

  const handleStop = useCallback(() => {
    setAudioState({ isPlaying: false, isSilenceGap: false });
  }, [setAudioState]);

  const handlePersona = useCallback(
    (persona: typeof agePersona) => {
      const presets: Record<
        typeof agePersona,
        { masking: typeof maskingMode; script: typeof preferredScript; target: number }
      > = {
        early_child: { masking: "full", script: "uthmani", target: 5 },
        junior: { masking: "first-letter", script: "indopak", target: 10 },
        teen_adult: { masking: "hidden", script: "uthmani", target: 20 },
      };
      const p = presets[persona];
      setPersonalization(persona, p.masking, p.script, p.target);
    },
    [setPersonalization]
  );

  const audioSourceLabel = useMemo(() => {
    const reciter = RECITERS.find((r) => r.id === selectedReciter);
    return reciter?.name ?? selectedReciter;
  }, [selectedReciter]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Memuat Surah {surahNumber}…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="max-w-md text-center text-sm text-red-600 dark:text-red-400">{error}</p>
        <Link
          href="/reader"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Kembali ke daftar surah
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/reader" className="hover:text-emerald-600">
            Daftar Surah
          </Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-200">
            {data?.name ?? surahMeta?.nameId ?? `Surah ${surahNumber}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 font-arabic text-2xl font-bold text-white shadow">
              {surahNumber}
            </span>
            <div>
              <h1
                lang="ar"
                dir="rtl"
                className="font-arabic text-3xl font-bold text-slate-900 dark:text-slate-50"
              >
                {surahMeta?.nameArabic}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {data?.name} · {totalAyat} ayat · {surahMeta?.revelation}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="gap-1.5"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Pengaturan</span>
            </Button>
            {isPlaying ? (
              <Button onClick={handleStop} variant="destructive" size="sm" className="gap-1.5">
                <Square className="h-4 w-4 fill-current" /> Berhenti
              </Button>
            ) : (
              <Button onClick={handleStart} size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                <Play className="h-4 w-4 fill-current" /> Putar Semua ({totalAyat} ayat)
              </Button>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowSettings(false)}
            aria-hidden="true"
          />
          {/* Drawer Content */}
          <div className="relative w-full animate-in slide-in-from-bottom-full rounded-t-3xl border-t border-zinc-200 bg-white p-6 pb-safe shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:mx-auto sm:max-w-2xl">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Pengaturan Bacaan & Audio</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>Tutup</Button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto scrollbar-none px-1 pb-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="persona" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Profil Usia
                  </label>
                  <select
                    id="persona"
                    value={agePersona}
                    onChange={(e) => handlePersona(e.target.value as typeof agePersona)}
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {(Object.keys(PERSONA_LABEL) as Array<typeof agePersona>).map((k) => (
                      <option key={k} value={k}>
                        {PERSONA_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="masking" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Mode Masking
                  </label>
                  <select
                    id="masking"
                    value={maskingMode}
                    onChange={(e) => setPersonalization(agePersona, e.target.value as typeof maskingMode, preferredScript, targetDailyVerses)}
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {(Object.keys(MASKING_LABEL) as Array<typeof maskingMode>).map((k) => (
                      <option key={k} value={k}>
                        {MASKING_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="reciter" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Qari Murottal
                  </label>
                  <select
                    id="reciter"
                    value={selectedReciter}
                    onChange={(e) => setAudioState({ selectedReciter: e.target.value })}
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Ulangan per Ayat: {repeatPerAyah}x · Jeda: {delayRatio.toFixed(1)}×
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={7}
                      value={repeatPerAyah}
                      onChange={(e) => setAudioState({ repeatPerAyah: Number(e.target.value) })}
                      className="flex-1 accent-emerald-600"
                      aria-label="Jumlah ulangan per ayat"
                    />
                    <input
                      type="range"
                      min={0.5}
                      max={2.5}
                      step={0.1}
                      value={delayRatio}
                      onChange={(e) => setAudioState({ delayRatio: Number(e.target.value) })}
                      className="flex-1 accent-amber-500"
                      aria-label="Rasio jeda hening"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span>Target: {targetDailyVerses} ayat</span>
                    <button
                      type="button"
                      onClick={() => setShowTranslation((v) => !v)}
                      className="text-emerald-600 underline-offset-2 hover:underline"
                    >
                      {showTranslation ? "Sembunyikan" : "Tampilkan"} terjemahan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTafsir((v) => !v)}
                      className="text-emerald-600 underline-offset-2 hover:underline"
                    >
                      {showTafsir ? "Sembunyikan" : "Tampilkan"} tafsir
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setTajweedEnabled((v) => !v)}
                    className={`inline-flex w-full justify-center items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      tajweedEnabled
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    <Palette className="h-4 w-4" />
                    <span>{tajweedEnabled ? "Tajwid Berwarna Aktif" : "Tampilkan Tajwid Berwarna"}</span>
                  </button>
                  <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    Penanda warna hukum bacaan (Ghunnah, Idgham, Ikhfa, Iqlab, Mad, dll).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <TajweedLegend />

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Audio: {audioSourceLabel}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          Ketuk kata untuk membuka masking
        </span>
      </div>

      <div className="flex flex-col gap-8">
        {data?.verses.map((verse, idx) => (
          <article
            key={verse.number}
            id={`ayah-${verse.number}`}
            className={`cv-auto rounded-2xl border p-5 transition-colors ${
              currentAyahIndex === idx && isPlaying
                ? "border-emerald-400 bg-emerald-50/60 dark:border-emerald-700 dark:bg-emerald-950/40"
                : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {verse.number}
              </span>
              <AyahAudioEngine
                surahNumber={surahNumber}
                ayahNumber={verse.number}
                ayahIndex={idx}
                reciter={selectedReciter}
              />
            </div>

            {tajweedEnabled && tajweedState?.surah === surahNumber ? (
              <TajweedText
                text={
                  tajweedState.tanzil.get(verse.number) ??
                  verse.textArabicUthmani
                }
                ranges={tajweedState.map.get(verse.number) ?? []}
                fontSize="large"
                onCharClick={openMakhraj}
              />
            ) : (
              <WordMaskingContainer
                textUthmani={verse.textArabicUthmani}
                textIndopak={verse.textArabicIndopak}
                script={preferredScript}
                mode={maskingMode}
                fontSize="large"
                onWordClick={(word) => openMakhraj(firstArabicChar(word))}
              />
            )}

            {showTranslation && verse.translationId && (
              <>
                <Separator className="my-4" />
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {verse.translationId}
                </p>
              </>
            )}

            {showTafsir && verse.tafsirId && (
              <div className="mt-3 rounded-lg bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Tafsir (Kemenag RI)
                </p>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                  {verse.tafsirId}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAudioState({
                    isPlaying: true,
                    currentAyahIndex: idx,
                    currentAyahRepeat: 0,
                    isSilenceGap: false,
                  });
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ulangi Ayat
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={idx >= totalAyat - 1}
                onClick={() => nextAyah()}
              >
                Ayat berikutnya →
              </Button>
              <RecitationRecorder
                surahNumber={surahNumber}
                ayahNumber={verse.number}
                masterAudioUrl={proxyAudioUrl(
                  selectedReciter,
                  surahNumber,
                  verse.number
                )}
              />
              <BookmarkButton surah={surahNumber} ayah={verse.number} />
            </div>
          </article>
        ))}
      </div>

      {makhrajZone && (
        <MakhrajPopup zone={makhrajZone} onClose={() => setMakhrajZone(null)} />
      )}
    </div>
  );
};
