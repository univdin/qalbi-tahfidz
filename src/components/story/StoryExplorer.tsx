"use client";

import { useRef, useState } from "react";
import { STORIES, MORAL_TAG_LABEL, MORAL_TAG_COLOR } from "@/data/stories";
import { StoryGraph, useOpenReader } from "@/components/story/StoryGraph";
import { BookMarked } from "lucide-react";

export function StoryExplorer() {
  const [selectedId, setSelectedId] = useState(STORIES[0].id);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const openReader = useOpenReader();
  const story = STORIES.find((s) => s.id === selectedId) ?? STORIES[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="flex flex-col gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Kisah Pilihan
        </h2>
        {STORIES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelect(s.id)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              s.id === selectedId
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                : "border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/60"
            }`}
          >
            <p className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <BookMarked className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{s.title}</span>
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {s.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: MORAL_TAG_COLOR[t] }}
                >
                  {MORAL_TAG_LABEL[t]}
                </span>
              ))}
            </div>
          </button>
        ))}
      </aside>

      <div ref={detailRef} className="flex flex-col gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50">
            <BookMarked className="h-6 w-6 text-emerald-600 shrink-0" />
            <span>{story.title}</span>
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {story.desc}
          </p>
        </div>

        <StoryGraph story={story} onOpen={openReader} />

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Nilai akhlak:</span>
          {story.tags.map((t) => (
            <span
              key={t}
              className="rounded-full px-2 py-0.5 font-semibold text-white"
              style={{ backgroundColor: MORAL_TAG_COLOR[t] }}
            >
              {MORAL_TAG_LABEL[t]}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Sumber: kurasi tim berdasarkan rujukan tafsir &amp; ayat Al-Qur&apos;an.
          Klik node untuk membuka ayat di pembaca surah.
        </p>
      </div>
    </div>
  );
}
