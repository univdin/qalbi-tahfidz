"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/core/supabase/client";
import { useAudioStore } from "@/store/useAudioStore";

/**
 * Sinkronkan preferensi (tema, ukuran font, qari, skrip) ke Supabase.
 * Dipasang global di layout aplikasi.
 */
export function PrefsSync() {
  const { resolvedTheme, setTheme } = useTheme();
  const { fontScale, selectedReciter, preferredScript, setAudioState } =
    useAudioStore();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    void (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("profiles")
          .select("theme, font_scale, preferred_qari, preferred_script")
          .eq("id", user.id)
          .maybeSingle();
        if (!data) return;
        if (data.theme) setTheme(data.theme as string);
        if (data.font_scale) setAudioState({ fontScale: data.font_scale as number });
        if (data.preferred_qari) setAudioState({ selectedReciter: data.preferred_qari as string });
        if (data.preferred_script) setAudioState({ preferredScript: data.preferred_script as "uthmani" | "indopak" });
        loaded.current = true;
      } catch {
        // abaikan
      }
    })();
  }, [setTheme, setAudioState]);

  useEffect(() => {
    if (!loaded.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void (async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          await supabase
            .from("profiles")
            .update({
              theme: resolvedTheme,
              font_scale: fontScale,
              preferred_qari: selectedReciter,
              preferred_script: preferredScript,
            })
            .eq("id", user.id);
        } catch {
          // abaikan
        }
      })();
    }, 2000);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [resolvedTheme, fontScale, selectedReciter, preferredScript]);

  return null;
}
