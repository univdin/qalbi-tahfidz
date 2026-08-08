"use client";

import { diffWords } from "@/lib/mutashabihat";

interface Props {
  aText: string;
  bText: string;
  aLabel: string;
  bLabel: string;
}

function renderTokens(
  tokens: { word: string; status: "same" | "onlyA" | "onlyB" }[],
  highlight: "onlyA" | "onlyB"
) {
  return tokens.map((t, i) => (
    <span
      key={i}
      className={
        t.status === highlight
          ? "rounded bg-amber-200 px-0.5 font-bold text-amber-900 dark:bg-amber-500/40 dark:text-amber-100"
          : ""
      }
    >
      {t.word}{" "}
    </span>
  ));
}

export function DiffViewer({ aText, bText, aLabel, bLabel }: Props) {
  const diff = diffWords(aText, bText);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
          {aLabel}
        </span>
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic text-2xl leading-loose"
        >
          {renderTokens(diff.a, "onlyA")}
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
          {bLabel}
        </span>
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic text-2xl leading-loose"
        >
          {renderTokens(diff.b, "onlyB")}
        </p>
      </div>
    </div>
  );
}
