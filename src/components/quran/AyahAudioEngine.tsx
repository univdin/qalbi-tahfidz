"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { getSurahMeta, proxyAudioUrl } from "@/lib/surahs";

interface AyahAudioEngineProps {
  surahNumber: number;
  ayahNumber: number;
  /** Nomor urut ayat (0-based) di dalam surah, dipakai untuk sinkronisasi store */
  ayahIndex: number;
  reciter: string;
}

/**
 * Memutar satu ayat (via proxy everyayah) secara berulang
 * (repeatPerAyah) dengan jeda hening otomatis (delayRatio).
 * Setelah repeat terpenuhi, otomatis lanjut ke ayat berikutnya (atau berhenti
 * bila itu ayat terakhir).
 */
export const AyahAudioEngine: React.FC<AyahAudioEngineProps> = ({
  surahNumber,
  ayahNumber,
  ayahIndex,
  reciter,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isPlaying,
    isSilenceGap,
    repeatPerAyah,
    delayRatio,
    currentAyahIndex,
    currentAyahRepeat,
    playbackRate,
    setAudioState,
    incrementAyahRepeat,
    resetAyahRepeat,
    nextAyah,
  } = useAudioStore();

  const isActive = isPlaying && currentAyahIndex === ayahIndex;
  const surahMeta = getSurahMeta(surahNumber);
  const isLastAyah = ayahIndex >= (surahMeta?.ayahCount ?? 0) - 1;

  useEffect(() => {
    if (!isActive) return;
    if (currentAyahRepeat >= repeatPerAyah) return;

    const url = proxyAudioUrl(reciter, surahNumber, ayahNumber);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.playbackRate = playbackRate;
    audio.preload = "auto";

    const playCurrent = () => {
      audio.play().catch(() => {
        setAudioState({ isPlaying: false });
      });
    };

    const handleEnded = () => {
      const duration = audio.duration || 8;
      const delayMs = (duration * delayRatio * 1000) / playbackRate;

      setAudioState({ isSilenceGap: true });
      timeoutRef.current = setTimeout(() => {
        setAudioState({ isSilenceGap: false });
        incrementAyahRepeat();
      }, delayMs);
    };

    audio.addEventListener("ended", handleEnded);

    playCurrent();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, [
    isActive,
    currentAyahRepeat,
    repeatPerAyah,
    delayRatio,
    playbackRate,
    ayahNumber,
    surahNumber,
    reciter,
    incrementAyahRepeat,
    setAudioState,
  ]);

  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setAudioState({ isSilenceGap: false });
    }
  }, [isPlaying, setAudioState]);

  useEffect(() => {
    if (currentAyahIndex !== ayahIndex) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [currentAyahIndex, ayahIndex]);

  useEffect(() => {
    if (
      currentAyahRepeat >= repeatPerAyah &&
      isPlaying &&
      currentAyahIndex === ayahIndex
    ) {
      resetAyahRepeat();
      if (isLastAyah) {
        setAudioState({ isPlaying: false, isSilenceGap: false });
      } else {
        nextAyah();
      }
    }
  }, [
    currentAyahRepeat,
    repeatPerAyah,
    isPlaying,
    currentAyahIndex,
    ayahIndex,
    isLastAyah,
    resetAyahRepeat,
    nextAyah,
    setAudioState,
  ]);

  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-live="polite"
      aria-label={`Audio ayat ${ayahNumber}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {isActive && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${
              isSilenceGap ? "bg-amber-400 opacity-75" : "bg-emerald-500"
            } animate-ping`}
          />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            isActive
              ? isSilenceGap
                ? "bg-amber-400"
                : "bg-emerald-500"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />
      </span>
      {isActive && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isSilenceGap
            ? "Giliranmu tirukan…"
            : `Ulangan ${currentAyahRepeat + 1}/${repeatPerAyah}`}
        </span>
      )}
    </div>
  );
};
