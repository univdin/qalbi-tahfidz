"use client";

import Link from "next/link";
import { STORIES, MORAL_TAG_LABEL, MORAL_TAG_COLOR, type MoralTag } from "@/data/stories";

export function MoralBrowser() {
  const tags = Object.keys(MORAL_TAG_LABEL) as MoralTag[];

  return (
    <div className="flex w-full flex-col gap-6">
      {tags.map((tag) => {
        const items = STORIES.flatMap((s) =>
          s.nodes
            .filter((n) => n.tag === tag)
            .map((n) => ({ story: s.title, label: n.label, ref: n.ref }))
        );
        if (items.length === 0) return null;
        return (
          <section key={tag} className="flex flex-col gap-2">
            <h2
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ backgroundColor: MORAL_TAG_COLOR[tag] }}
            >
              {MORAL_TAG_LABEL[tag]}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((it, i) => {
                const [s, a] = it.ref.split(":");
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {it.label}
                    </p>
                    <p className="text-xs text-slate-400">
                      {it.story} · {it.ref}
                    </p>
                    <Link
                      href={`/reader/${s}#ayah-${a}`}
                      className="mt-1 inline-block text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Buka ayat ↗
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
