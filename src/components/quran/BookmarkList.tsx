"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import { getSurahMeta } from "@/lib/surahs";

interface BookmarkRow {
  id: string;
  surah_id: number;
  verse_id: number;
  created_at: string;
}

export function BookmarkList() {
  const [items, setItems] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        const { data } = await supabase
          .from("user_bookmarks")
          .select("id, surah_id, verse_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setItems((data as BookmarkRow[] | null) ?? []);
      } catch {
        // abaikan
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const remove = async (id: string) => {
    await supabase.from("user_bookmarks").delete().eq("id", id);
    setItems((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat penanda…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Belum ada ayat yang ditandai. Ketuk tombol &quot;🔖 Tandai&quot; di pembaca surah.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((b) => {
        const meta = getSurahMeta(b.surah_id);
        return (
          <div
            key={b.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {meta?.nameArabic} · {meta?.nameId ?? b.surah_id} — ayat {b.verse_id}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(b.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/reader/${b.surah_id}#ayah-${b.verse_id}`}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Buka
              </Link>
              <button
                type="button"
                onClick={() => remove(b.id)}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:border-slate-700 dark:hover:bg-red-950"
              >
                Hapus
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
