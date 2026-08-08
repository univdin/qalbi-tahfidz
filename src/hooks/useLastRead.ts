"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/core/supabase/client";

export function useLastRead() {
  const [lastRead, setLastRead] = useState<{
    surah_id: number;
    verse_id: number;
  } | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("user_last_read")
          .select("surah_id, verse_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setLastRead({
            surah_id: data.surah_id as number,
            verse_id: data.verse_id as number,
          });
        }
      } catch {
        // abaikan
      }
    })();
  }, []);

  const saveLastRead = useCallback(async (surah: number, verse: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_last_read").upsert({
        user_id: user.id,
        surah_id: surah,
        verse_id: verse,
        updated_at: new Date().toISOString(),
      });
      setLastRead({ surah_id: surah, verse_id: verse });
    } catch {
      // abaikan
    }
  }, []);

  return { lastRead, saveLastRead };
}
