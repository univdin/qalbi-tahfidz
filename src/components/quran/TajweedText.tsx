"use client";

import type { TajweedRange } from "@/lib/tajweed";
import { TAJWEED_RULES } from "@/lib/tajweed";
import { firstArabicChar } from "@/lib/makhraj";

interface Props {
  text: string;
  ranges: TajweedRange[];
  fontSize?: "large" | "medium" | "small";
  onCharClick?: (char: string) => void;
}

const FONT_CLASSES = {
  large: "text-4xl leading-loose",
  medium: "text-3xl leading-relaxed",
  small: "text-2xl leading-normal",
};

function clickable(
  content: string,
  key: string,
  ruleLabel: string | null,
  ruleDesc: string | null,
  onCharClick?: (char: string) => void
): React.ReactNode {
  return (
    <span
      key={key}
      className={ruleLabel ? "cursor-help" : "cursor-pointer"}
      title={ruleLabel ? `${ruleLabel} — ${ruleDesc ?? ""}` : undefined}
      onClick={(e) => {
        e.stopPropagation();
        const ch = firstArabicChar(content);
        if (ch) onCharClick?.(ch);
      }}
    >
      {content}
    </span>
  );
}

/**
 * Render teks Arab dengan highlight warna sesuai aturan tajwid.
 * Indeks range adalah offset codepoint terhadap teks Tanzil Uthmani.
 */
export function TajweedText({ text, ranges, fontSize = "large", onCharClick }: Props) {
  const chars = [...text];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const r of sorted) {
    const start = Math.max(cursor, r.start);
    const end = Math.min(chars.length - 1, r.end);
    if (start > end) continue;
    if (start > cursor) {
      nodes.push(
        clickable(
          chars.slice(cursor, start).join(""),
          `plain-${cursor}`,
          null,
          null,
          onCharClick
        )
      );
    }
    const rule = TAJWEED_RULES[r.rule];
    const seg = chars.slice(start, end + 1).join("");
    nodes.push(
      <span
        key={`${r.rule}-${start}`}
        className="cursor-help"
        style={{ color: rule?.color ?? "#10b981", fontWeight: 700 }}
        title={rule ? `${rule.label} — ${rule.desc}` : undefined}
        onClick={(e) => {
          e.stopPropagation();
          const ch = firstArabicChar(seg);
          if (ch) onCharClick?.(ch);
        }}
      >
        {seg}
      </span>
    );
    cursor = end + 1;
  }

  if (cursor < chars.length) {
    nodes.push(
      clickable(
        chars.slice(cursor).join(""),
        `plain-end-${cursor}`,
        null,
        null,
        onCharClick
      )
    );
  }

  return (
    <div
      dir="rtl"
      lang="ar"
      className={`font-arabic ${FONT_CLASSES[fontSize]}`}
      role="note"
      aria-label="Teks ayat dengan penanda tajwid berwarna"
    >
      {nodes}
    </div>
  );
}
