"use client";

import { useState } from "react";
import { TAJWEED_RULES } from "@/lib/tajweed";

export function TajweedLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Legenda Warna Tajwid
        </span>
        <span className="text-xs text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="grid grid-cols-1 gap-2 border-t border-slate-100 p-4 sm:grid-cols-2 dark:border-slate-700">
          {Object.entries(TAJWEED_RULES).map(([code, rule]) => (
            <li key={code} className="flex items-start gap-2">
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: rule.color }}
              />
              <span>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  {rule.label}
                </span>
                <span className="block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                  {rule.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
