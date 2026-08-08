"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SURAHS, getSurahMeta } from "@/lib/surahs";
import { useSupabaseSync, type HifzCategory } from "@/hooks/useSupabaseSync";
import type { Grade } from "ts-fsrs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const CATEGORY_LABEL: Record<HifzCategory, string> = {
  sabaq: "Sabaq (Baru)",
  sabqi: "Sabqi (Pekan Ini)",
  manzil: "Manzil (Lama)",
};

const CATEGORY_COLOR: Record<HifzCategory, string> = {
  sabaq: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  sabqi: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  manzil: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const RATINGS: { grade: Grade; label: string; desc: string; className: string }[] = [
  {
    grade: 1,
    label: "Ulangi",
    desc: "Lupa — ulangi",
    className: "bg-red-600 hover:bg-red-700",
  },
  {
    grade: 2,
    label: "Sulit",
    desc: "Sulit diingat",
    className: "bg-amber-500 hover:bg-amber-600",
  },
  {
    grade: 3,
    label: "Lancar",
    desc: "Lancar",
    className: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    grade: 4,
    label: "Sangat Mudah",
    desc: "Sangat mudah",
    className: "bg-teal-600 hover:bg-teal-700",
  },
];

const JUZ30 = SURAHS.filter((s) => s.number >= 78);

export const SrsDeck: React.FC = () => {
  const { cards, dueCards, loading, reviewCardAction, createCardAction } =
    useSupabaseSync();

  const [surahNumber, setSurahNumber] = useState(78);
  const [ayahStart, setAyahStart] = useState(1);
  const [ayahEnd, setAyahEnd] = useState(1);
  const [category, setCategory] = useState<HifzCategory>("sabaq");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const selectedSurah = getSurahMeta(surahNumber);

  const sortedDue = useMemo(
    () =>
      [...dueCards].sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ),
    [dueCards]
  );

  const handleCreate = async () => {
    const end = Math.max(ayahStart, ayahEnd);
    const start = Math.min(ayahStart, ayahEnd);
    if (!selectedSurah || start < 1 || end > selectedSurah.ayahCount) return;
    setCreating(true);
    try {
      await createCardAction(surahNumber, start, end, category);
    } catch (err) {
      console.error("Gagal membuat kartu:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleRate = async (cardId: string, rating: Grade) => {
    const existing = cards.find((c) => c.id === cardId);
    if (!existing) return;
    setBusyId(cardId);
    try {
      await reviewCardAction(
        existing,
        existing.surahNumber,
        existing.ayahStart,
        existing.ayahEnd,
        rating
      );
    } catch (err) {
      console.error("Gagal menyimpan rating:", err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href="/reader" className="text-sm text-slate-500 hover:text-emerald-600">
          ← Kembali ke daftar surah
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Jadwal Ulangan Hafalan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pengulangan terjadwal untuk menjaga kelekatan hafalan anak (Sabaq, Sabqi &amp; Manzil).
            </p>
          </div>
          <Badge variant="secondary">
            {dueCards.length} kartu jatuh tempo hari ini
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Kartu Sabaq</CardTitle>
          <CardDescription>
            Tambahkan ayat baru yang sedang dihafal (Sabaq), atau jadwalkan
            ulangan Sabqi/Manzil.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="deck-surah"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Surah
            </label>
            <select
              id="deck-surah"
              value={surahNumber}
              onChange={(e) => {
                const num = Number(e.target.value);
                const meta = getSurahMeta(num);
                setSurahNumber(num);
                setAyahStart(1);
                setAyahEnd(1);
                if (meta) setAyahEnd(Math.min(meta.ayahCount, 1));
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <optgroup label="Juz 30">
                {JUZ30.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.nameId} ({s.ayahCount} ayat)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Surah lainnya">
                {SURAHS.filter((s) => s.number < 78).map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.nameId} ({s.ayahCount} ayat)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ayat mulai
              </label>
              <Input
                type="number"
                min={1}
                max={selectedSurah?.ayahCount ?? 1}
                value={ayahStart}
                onChange={(e) => setAyahStart(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ayat selesai
              </label>
              <Input
                type="number"
                min={1}
                max={selectedSurah?.ayahCount ?? 1}
                value={ayahEnd}
                onChange={(e) => setAyahEnd(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HifzCategory)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                {(Object.keys(CATEGORY_LABEL) as HifzCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={creating || !selectedSurah}
            className="w-full gap-2"
          >
            {creating ? "Menyimpan…" : "＋ Tambah Kartu"}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Kartu Jatuh Tempo
        </h2>
        {loading && (
          <p className="text-sm text-slate-500">Memuat kartu hafalan…</p>
        )}

        {!loading && sortedDue.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-slate-500">
              Tidak ada kartu yang jatuh tempo. Tambahkan kartu Sabaq baru atau
              nikmati hari libur pengulangan. 🎉
            </CardContent>
          </Card>
        )}

        {sortedDue.map((card) => {
          const meta = getSurahMeta(card.surahNumber);
          return (
            <Card key={card.id} className="p-5">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 font-arabic text-lg font-bold text-white">
                      {card.surahNumber}
                    </span>
                    <div>
                      <p
                        lang="ar"
                        dir="rtl"
                        className="font-arabic text-xl font-bold text-slate-900 dark:text-slate-50"
                      >
                        {meta?.nameArabic}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {meta?.nameId} · Ayat {card.ayahStart}
                        {card.ayahEnd > card.ayahStart
                          ? `–${card.ayahEnd}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <Badge className={CATEGORY_COLOR[card.category]}>
                    {CATEGORY_LABEL[card.category]}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>Kekuatan Memori: {card.stability.toFixed(1)} Hari</span>
                  <span>Diulang: {card.reps}x</span>
                  <span>
                    Jatuh Tempo:{" "}
                    {new Date(card.dueDate).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/reader/${card.surahNumber}#ayah-${card.ayahStart}`}
                    className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Buka Teks Ayat
                  </Link>
                  <div className="ml-auto flex items-center gap-2">
                    {RATINGS.map((r) => (
                      <Button
                        key={r.grade}
                        size="sm"
                        disabled={busyId === card.id}
                        onClick={() => handleRate(card.id, r.grade)}
                        className={`${r.className} text-white`}
                      >
                        {r.label}
                      </Button>
                    ))}
                  </div>
                </div>
                {busyId === card.id && (
                  <p className="text-xs text-slate-400">
                    Menyimpan hasil ulangan…
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
