"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { getSurahMeta } from "@/lib/surahs";
import { Check, Download, Share2 } from "lucide-react";

const THEMES = [
  { id: "dark", label: "Gelap", card: "bg-zinc-900", text: "text-white", sub: "text-emerald-300", accent: "text-emerald-400" },
  { id: "premium", label: "Premium", card: "bg-gradient-to-br from-emerald-900 via-teal-900 to-zinc-900", text: "text-white", sub: "text-emerald-200", accent: "text-amber-300" },
  { id: "paper", label: "Kertas", card: "bg-amber-50", text: "text-zinc-900", sub: "text-zinc-600", accent: "text-emerald-700" },
] as const;

interface Props {
  surah: number;
  ayah: number;
  arabic: string;
  translation?: string;
  onClose: () => void;
}

export function ShareSheet({ surah, ayah, arabic, translation, onClose }: Props) {
  const [theme, setTheme] = useState<{ id: string; label: string; card: string; text: string; sub: string; accent: string }>(THEMES[0]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const meta = getSurahMeta(surah);
  const url = `${window.location.origin}/reader/${surah}#ayah-${ayah}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const png = await toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = png;
      a.download = `quran-${surah}-${ayah}.png`;
      a.click();
    } catch {
      // abaikan
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const title = `${meta?.nameId ?? `Surah ${surah}`} · Ayat ${ayah} — QalbiTahfidz`;
    const text = `${translation ?? arabic}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // dibatalkan
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
    } catch {
      // abaikan
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-5 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Bagikan Ayat</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
                theme.id === t.id
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          ref={cardRef}
          className={`flex flex-col items-center gap-3 rounded-2xl p-6 text-center ${theme.card}`}
        >
          <p
            dir="rtl"
            lang="ar"
            className={`font-arabic text-3xl leading-loose ${theme.text}`}
          >
            {arabic}
          </p>
          {translation && (
            <p className={`text-sm leading-6 ${theme.sub}`}>{translation}</p>
          )}
          <p className={`text-xs font-semibold ${theme.accent}`}>
            {meta?.nameId ?? `Surah ${surah}`} · Ayat {ayah}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {busy ? "Menyiapkan…" : "Unduh"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" /> Tersalin
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> {"share" in navigator ? "Bagikan" : "Salin"}
              </>
            )}
          </button>
        </div>
        {copied && !("share" in navigator) && (
          <p className="text-center text-xs text-emerald-600">Tautan disalin.</p>
        )}
      </div>
    </div>
  );
}
