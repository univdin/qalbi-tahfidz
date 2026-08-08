"use client";

import { useEffect } from "react";
import { getSurahMeta } from "@/lib/surahs";
import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, SkipBack, SkipForward, Square } from "lucide-react";

export function FloatingAudioPlayer() {
  const {
    isPlaying,
    currentAyahIndex,
    activeSurah,
    nextAyah,
    setAudioState,
  } = useAudioStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeSurah) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        setAudioState({ isPlaying: !isPlaying });
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextAyah();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setAudioState({ currentAyahIndex: Math.max(0, currentAyahIndex - 1), currentAyahRepeat: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSurah, isPlaying, currentAyahIndex, nextAyah, setAudioState]);

  if (!isPlaying || !activeSurah) return null;

  const meta = getSurahMeta(activeSurah);
  const ayah = currentAyahIndex + 1;

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[68px] z-40 flex justify-center px-4 sm:bottom-6 sm:justify-end sm:pr-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 py-1.5 pl-4 pr-1.5 shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="min-w-0 max-w-[140px]">
          <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-50">
            {meta?.nameId ?? `Surah ${activeSurah}`}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Ayat {ayah}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className={btn}
            aria-label="Ayat sebelumnya"
            onClick={() =>
              setAudioState({
                currentAyahIndex: Math.max(0, currentAyahIndex - 1),
                currentAyahRepeat: 0,
              })
            }
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
            aria-label={isPlaying ? "Jeda" : "Putar"}
            onClick={() => setAudioState({ isPlaying: !isPlaying })}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>
          <button
            type="button"
            className={btn}
            aria-label="Ayat berikutnya"
            onClick={() => nextAyah()}
          >
            <SkipForward className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={btn}
            aria-label="Berhenti"
            onClick={() =>
              setAudioState({
                isPlaying: false,
                activeSurah: null,
                isSilenceGap: false,
              })
            }
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
