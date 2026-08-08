"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/core/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Send } from "lucide-react";

interface Reflection {
  id: string;
  user_id: string;
  text: string;
  is_public: boolean;
  likes: number;
  created_at: string;
}

interface Props {
  surah: number;
  ayah: number;
}

export function ReflectionsTab({ surah, ayah }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      let query = supabase
        .from("ayah_reflections")
        .select("id, user_id, text, is_public, likes, created_at")
        .eq("surah_id", surah)
        .eq("verse_id", ayah)
        .order("created_at", { ascending: false });

      if (user) {
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`) as typeof query;
      } else {
        query = query.eq("is_public", true);
      }

      const { data } = await query;
      setItems((data as Reflection[] | null) ?? []);
      setLoading(false);
    })();
  }, [surah, ayah]);

  const submit = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/auth/login?redirect=/reader/${surah}#ayah-${ayah}`);
      setSending(false);
      return;
    }
    const { data } = await supabase
      .from("ayah_reflections")
      .insert({
        user_id: user.id,
        surah_id: surah,
        verse_id: ayah,
        text: text.trim(),
        is_public: isPublic,
      })
      .select("id, user_id, text, is_public, likes, created_at")
      .single();
    if (data) setItems((prev) => [data as Reflection, ...prev]);
    setText("");
    setSending(false);
  };

  const toggleLike = async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/auth/login?redirect=/reader/${surah}#ayah-${ayah}`);
      return;
    }
    const { data: count } = await supabase.rpc("toggle_reflection_like", {
      p_reflection_id: id,
    });
    if (typeof count === "number" && count >= 0) {
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: count } : r))
      );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis perenungan hikmah ayat ini…"
          className="flex-1"
        />
        <Button onClick={submit} disabled={sending} className="gap-1.5">
          <Send className="h-4 w-4" /> Kirim
        </Button>
      </div>
      <label className="flex items-center gap-2 text-xs text-zinc-500">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="accent-emerald-600"
        />
        Tampilkan untuk umum (publik)
      </label>

      {loading && <p className="text-xs text-zinc-500">Memuat refleksi…</p>}

      <div className="flex flex-col gap-2">
        {items.map((r) => {
          const mine = userId && r.user_id === userId;
          return (
            <div
              key={r.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60"
            >
              <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                {r.text}
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  {mine ? "Milikmu" : "Pengguna"} · {r.is_public ? "Publik" : "Pribadi"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleLike(r.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-600"
                  aria-label="Suka refleksi ini"
                >
                  <Heart className="h-3.5 w-3.5" /> {r.likes}
                </button>
              </div>
            </div>
          );
        })}
        {!loading && items.length === 0 && (
          <p className="text-xs text-zinc-400">
            Belum ada refleksi. Jadilah yang pertama berbagi hikmah.
          </p>
        )}
      </div>
    </div>
  );
}
