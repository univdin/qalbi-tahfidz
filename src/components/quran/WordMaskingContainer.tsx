"use client";

import React, { useState } from "react";
import type { MaskingMode, QuranScript } from "@/store/useAudioStore";

interface Props {
  textUthmani: string;
  textIndopak?: string;
  script?: QuranScript;
  mode: MaskingMode;
  fontSize?: "large" | "medium" | "small";
}

export const WordMaskingContainer: React.FC<Props> = ({
  textUthmani,
  textIndopak,
  script = "indopak",
  mode,
  fontSize = "large",
}) => {
  const activeText =
    script === "indopak" && textIndopak ? textIndopak : textUthmani;
  const words = activeText.split(" ");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggle = (idx: number) => {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const stripDiacritics = (word: string) =>
    word.replace(/[\u064B-\u065F\u0670]/g, "").charAt(0);

  const fontClasses =
    fontSize === "large"
      ? "text-4xl leading-loose"
      : fontSize === "medium"
        ? "text-3xl leading-relaxed"
        : "text-2xl leading-normal";

  const fontFamily = script === "indopak" ? "font-indopak" : "font-arabic";

  return (
    <div
      dir="rtl"
      className={`flex flex-wrap gap-3 ${fontFamily} ${fontClasses}`}
      role="group"
      aria-label="Teks ayat dengan mode masking"
    >
      {words.map((word, idx) => {
        const isRevealed = mode === "full" || revealed[idx];
        const display =
          isRevealed ? word : mode === "first-letter" ? stripDiacritics(word) : word;

        return (
          <button
            key={idx}
            type="button"
            onClick={() => toggle(idx)}
            aria-pressed={isRevealed}
            aria-label={
              isRevealed
                ? `Kata ${idx + 1}, tampil`
                : `Kata ${idx + 1}, tersembunyi, ketuk untuk menampilkan`
            }
            className={
              mode === "hidden" && !isRevealed
                ? "min-h-12 min-w-12 text-transparent bg-slate-200 dark:bg-slate-700 rounded-lg px-3 select-none transition-all"
                : mode === "first-letter" && !isRevealed
                  ? "min-h-12 min-w-12 text-amber-600 bg-amber-50 border-2 border-amber-300 rounded-lg px-3 font-bold shadow-sm"
                  : "min-h-12 min-w-12 px-2 hover:text-emerald-600 transition-colors"
            }
          >
            {display}
          </button>
        );
      })}
    </div>
  );
};
