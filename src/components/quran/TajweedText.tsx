"use client";

import type { TajweedRange } from "@/lib/tajweed";
import { TAJWEED_RULES } from "@/lib/tajweed";

interface Props {
  text: string;
  ranges: TajweedRange[];
  fontSize?: "large" | "medium" | "small";
}

const FONT_CLASSES = {
  large: "text-4xl leading-loose",
  medium: "text-3xl leading-relaxed",
  small: "text-2xl leading-normal",
};

/**
 * Render teks Arab dengan highlight warna sesuai aturan tajwid.
 * Indeks range adalah offset codepoint terhadap teks Tanzil Uthmani.
 */
export function TajweedText({ text, ranges, fontSize = "large" }: Props) {
  const chars = [...text];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const r of sorted) {
    const start = Math.max(cursor, r.start);
    const end = Math.min(chars.length - 1, r.end);
    if (start > end) continue;
    if (start > cursor) {
      nodes.push(chars.slice(cursor, start).join(""));
    }
    const rule = TAJWEED_RULES[r.rule];
    nodes.push(
      <span
        key={`${r.rule}-${start}`}
        style={{
          color: rule?.color ?? "#10b981",
          fontWeight: 700,
        }}
      >
        {chars.slice(start, end + 1).join("")}
      </span>
    );
    cursor = end + 1;
  }

  if (cursor < chars.length) {
    nodes.push(chars.slice(cursor).join(""));
  }

  return (
    <div
      dir="rtl"
      className={`font-arabic ${FONT_CLASSES[fontSize]}`}
      role="note"
      aria-label="Teks ayat dengan penanda tajwid berwarna"
    >
      {nodes}
    </div>
  );
}
