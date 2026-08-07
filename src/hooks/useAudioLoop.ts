"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAudioStore } from "@/store/useAudioStore";

export interface AyahSegmentTimestamp {
  ayahNumber: number;
  startTime: number;
  endTime: number;
}

export function useAudioLoop(
  timestamps: AyahSegmentTimestamp[],
  audioProxyUrl: string
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    repeatPerAyah,
    delayRatio,
    currentAyahRepeat,
    currentAyahIndex,
    isPlaying,
    playbackRate,
    setAudioState,
    incrementAyahRepeat,
    resetAyahRepeat,
    nextAyah,
  } = useAudioStore();

  const handleSilenceGap = useCallback(
    (durationSeconds: number, onComplete: () => void) => {
      setAudioState({ isSilenceGap: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const delayMs = (durationSeconds * delayRatio * 1000) / playbackRate;

      timeoutRef.current = setTimeout(() => {
        setAudioState({ isSilenceGap: false });
        onComplete();
      }, delayMs);
    },
    [delayRatio, playbackRate, setAudioState]
  );

  useEffect(() => {
    const audio = new Audio(audioProxyUrl);
    audioRef.current = audio;
    audio.playbackRate = playbackRate;

    const handleTimeUpdate = () => {
      if (!audioRef.current || timestamps.length === 0) return;

      const currentSegment = timestamps[currentAyahIndex];
      if (!currentSegment) return;

      if (audio.currentTime >= currentSegment.endTime) {
        audio.pause();
        const segmentDuration = currentSegment.endTime - currentSegment.startTime;

        if (currentAyahRepeat + 1 < repeatPerAyah) {
          handleSilenceGap(segmentDuration, () => {
            incrementAyahRepeat();
            if (audioRef.current) {
              audioRef.current.currentTime = currentSegment.startTime;
              audioRef.current.play().catch(console.error);
            }
          });
        } else {
          handleSilenceGap(segmentDuration, () => {
            resetAyahRepeat();
            if (currentAyahIndex + 1 < timestamps.length) {
              nextAyah();
            } else {
              setAudioState({ isPlaying: false });
            }
          });
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    audioProxyUrl,
    timestamps,
    currentAyahIndex,
    currentAyahRepeat,
    repeatPerAyah,
    playbackRate,
    handleSilenceGap,
    incrementAyahRepeat,
    resetAyahRepeat,
    nextAyah,
    setAudioState,
  ]);

  return { isPlaying };
}
