"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSurahMeta } from "@/lib/surahs";
import { UMMI_JUZ30, ummiAudioUrl } from "@/lib/ummiAudio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function UmmiPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loopSurah, setLoopSurah] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [loopAB, setLoopAB] = useState<{ a: number; b: number } | null>(null);
  const [markStep, setMarkStep] = useState<"idle" | "setA" | "setB">("idle");
  const [error, setError] = useState<string | null>(null);

  const currentMeta = currentSurah ? getSurahMeta(currentSurah) : null;

  const playSurah = useCallback((surah: number) => {
    const url = ummiAudioUrl(surah);
    if (!url) return;
    setCurrentSurah(surah);
    setSrc(url);
    setLoopAB(null);
    setMarkStep("idle");
    setError(null);
    setIsLoading(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsLoading(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  }, []);

  const goNext = useCallback(() => {
    if (!currentSurah) return;
    const idx = UMMI_JUZ30.findIndex((s) => s.surah === currentSurah);
    const next = UMMI_JUZ30[idx + 1];
    if (next) playSurah(next.surah);
    else {
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentSurah, playSurah]);

  const goPrev = useCallback(() => {
    if (!currentSurah) return;
    const idx = UMMI_JUZ30.findIndex((s) => s.surah === currentSurah);
    const prev = UMMI_JUZ30[idx - 1];
    if (prev) playSurah(prev.surah);
  }, [currentSurah, playSurah]);

  const handleEnded = useCallback(() => {
    if (loopAB) {
      if (audioRef.current) audioRef.current.currentTime = loopAB.a;
      return;
    }
    if (loopSurah) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      void audioRef.current?.play();
      return;
    }
    if (autoNext) {
      goNext();
    } else {
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [loopAB, loopSurah, autoNext, goNext]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (loopAB && audio.currentTime >= loopAB.b) {
      audio.currentTime = loopAB.a;
    }
  }, [loopAB]);

  const handleSetA = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setLoopAB({ a: audio.currentTime, b: loopAB?.b ?? audio.currentTime });
    setMarkStep("setB");
  };

  const handleSetB = () => {
    const audio = audioRef.current;
    if (!audio || markStep !== "setB") return;
    const a = loopAB?.a ?? 0;
    const b = audio.currentTime;
    setLoopAB(b > a ? { a, b } : { a: b, b: a });
    setMarkStep("idle");
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed, src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (audio.src && audio.currentTime >= audio.duration - 0.1) {
        audio.currentTime = 0;
      }
      void audio.play();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                {currentSurah ? `Surah ${currentSurah}` : "Belum ada surah diputar"}
              </p>
              <h2 className="truncate font-arabic text-2xl font-bold text-slate-900 dark:text-slate-50">
                {currentMeta?.nameArabic}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentMeta?.nameId} · {currentMeta?.ayahCount} ayat
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="icon" variant="outline" onClick={goPrev} aria-label="Surah sebelumnya">
                ⏮
              </Button>
              <Button onClick={togglePlay} disabled={!src || isLoading} className="w-24">
                {isLoading ? "Memuat…" : isPlaying ? "⏸ Jeda" : "▶ Putar"}
              </Button>
              <Button size="icon" variant="outline" onClick={goNext} aria-label="Surah berikutnya">
                ⏭
              </Button>
              <Button size="icon" variant="ghost" onClick={stop} aria-label="Berhenti">
                ⏹
              </Button>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={src ?? undefined}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onPlaying={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onError={() => {
              setError("Gagal memuat audio. Periksa koneksi lalu coba lagi.");
              setIsLoading(false);
            }}
            preload="metadata"
          />

          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-slate-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = t;
                setCurrentTime(t);
              }}
              className="flex-1 accent-emerald-600"
              aria-label="Posisi pemutaran"
            />
            <span className="text-xs tabular-nums text-slate-500">{formatTime(duration)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                    speed === s
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLoopSurah((v) => !v)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                loopSurah
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              🔁 Ulang surah
            </button>

            <button
              type="button"
              onClick={() => setAutoNext((v) => !v)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                autoNext
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              ⏭ Lanjut otomatis
            </button>

            <div className="flex items-center gap-1">
              {markStep === "setA" ? (
                <button
                  type="button"
                  onClick={handleSetA}
                  className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white"
                >
                  📍 Set A
                </button>
              ) : markStep === "setB" ? (
                <button
                  type="button"
                  onClick={handleSetB}
                  className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white"
                >
                  📍 Set B
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMarkStep("setA")}
                  disabled={!src}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
                >
                  A–B Loop
                </button>
              )}
              {loopAB && (
                <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  {formatTime(loopAB.a)}–{formatTime(loopAB.b)}
                  <button
                    type="button"
                    onClick={() => {
                      setLoopAB(null);
                      setMarkStep("idle");
                    }}
                    className="ml-1 hover:text-amber-900"
                    aria-label="Hapus loop A-B"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {UMMI_JUZ30.map((entry) => {
          const meta = getSurahMeta(entry.surah);
          const active = currentSurah === entry.surah;
          return (
            <button
              key={entry.surah}
              type="button"
              onClick={() => playSurah(entry.surah)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                active
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                  : "border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/60"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                }`}
              >
                {active && isPlaying ? "▶" : entry.surah}
              </span>
              <div className="min-w-0">
                <p className="truncate font-arabic text-lg font-bold text-slate-900 dark:text-slate-50">
                  {meta?.nameArabic}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {meta?.nameId} · {meta?.ayahCount} ayat
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
