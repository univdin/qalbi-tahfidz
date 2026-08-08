"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { JUZ30_QUESTS, questMeta } from "@/lib/quests";
import { useQuestProgress } from "@/hooks/useQuestProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  return (
    <span className={`${size === "lg" ? "text-2xl" : "text-sm"} text-amber-500`}>
      {"★".repeat(value)}
      <span className="text-slate-300 dark:text-slate-600">
        {"★".repeat(3 - value)}
      </span>
    </span>
  );
}

export function JuzAmmaQuest() {
  const { progress, loading, completeQuest } = useQuestProgress();
  const [picking, setPicking] = useState(false);

  const currentIdx = useMemo(
    () => JUZ30_QUESTS.findIndex((q) => !progress[q.id]),
    [progress]
  );
  const completedCount = Object.keys(progress).length;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-slate-50">
              Perjalanan Hafalan Juz Amma
            </h2>
            <span className="text-sm font-semibold text-emerald-600">
              {completedCount}/{JUZ30_QUESTS.length}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${(completedCount / JUZ30_QUESTS.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selesaikan tiap misi (2–5 ayat) lalu beri bintang. Misi berikutnya
            terbuka setelah yang sekarang selesai.
          </p>
        </CardContent>
      </Card>

      {loading && <p className="text-sm text-slate-500">Memuat progres…</p>}

      <ol className="flex flex-col gap-2">
        {JUZ30_QUESTS.map((quest, idx) => {
          const meta = questMeta(quest);
          const isDone = Boolean(progress[quest.id]);
          const isCurrent = idx === currentIdx;
          const isLocked = !isDone && !isCurrent;
          const p = progress[quest.id];

          return (
            <li key={quest.id}>
              <Card
                className={
                  isCurrent
                    ? "border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-900"
                    : isDone
                      ? "border-emerald-200 dark:border-emerald-900"
                      : isLocked
                        ? "opacity-50"
                        : ""
                }
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                          ? "bg-amber-400 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {quest.seq}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-arabic text-lg font-bold text-slate-900 dark:text-slate-50">
                      {meta?.nameArabic}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {quest.title}
                    </p>
                  </div>

                  {isDone && p ? (
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Stars value={p.stars} />
                      <Link
                        href={`/reader/${quest.surah}#ayah-${quest.start}`}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Buka ayat
                      </Link>
                    </div>
                  ) : isCurrent ? (
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {picking ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((s) => (
                            <Button
                              key={s}
                              size="sm"
                              onClick={() => {
                                void completeQuest(quest, s);
                                setPicking(false);
                              }}
                              aria-label={`Tandai selesai dengan ${s} bintang`}
                            >
                              {s}★
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => setPicking(true)}>
                          ✓ Tandai Selesai
                        </Button>
                      )}
                      <Link
                        href={`/reader/${quest.surah}#ayah-${quest.start}`}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Buka ayat
                      </Link>
                    </div>
                  ) : (
                    <span className="shrink-0 text-slate-300 dark:text-slate-600">
                      🔒
                    </span>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
