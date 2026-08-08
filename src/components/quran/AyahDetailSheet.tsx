"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkButton } from "@/components/quran/BookmarkButton";
import { getSurahMeta } from "@/lib/surahs";

export interface VerseDetail {
  surah: number;
  ayah: number;
  translation?: string;
  tafsir?: string;
}

interface Props {
  detail: VerseDetail | null;
  onClose: () => void;
}

export function AyahDetailSheet({ detail, onClose }: Props) {
  const [tab, setTab] = useState<"terjemahan" | "tafsir">("terjemahan");

  if (!detail) return null;
  const meta = getSurahMeta(detail.surah);

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ayat ${detail.ayah}`}
    >
      <div
        className="max-h-[70vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {meta?.nameId} · Ayat {detail.ayah}
            </p>
            <p className="text-xs text-zinc-500">
              {meta?.nameArabic} — {meta?.ayahCount} ayat
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          {(["terjemahan", "tafsir"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-white text-emerald-700 shadow-sm dark:bg-zinc-700 dark:text-emerald-300"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {t === "terjemahan" ? "Terjemahan" : "Tafsir Kemenag"}
            </button>
          ))}
        </div>

        <div className="min-h-[80px] text-[15px] leading-8 text-zinc-700 dark:text-zinc-200">
          {tab === "terjemahan" ? (
            detail.translation || "Terjemahan belum tersedia."
          ) : (
            detail.tafsir || "Tafsir belum tersedia."
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/reader/${detail.surah}#ayah-${detail.ayah}`}
            className="inline-flex h-10 items-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Buka di Reader
          </Link>
          <BookmarkButton surah={detail.surah} ayah={detail.ayah} />
        </div>
      </div>
    </div>
  );
}
