"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/core/supabase/client";
import { Button } from "@/components/ui/button";

interface Props {
  surah: number;
  ayah: number;
}

export function BookmarkButton({ surah, ayah }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("user_bookmarks")
          .select("id")
          .eq("user_id", user.id)
          .eq("surah_id", surah)
          .eq("verse_id", ayah)
          .maybeSingle();
        setActive(Boolean(data));
        setChecked(true);
      } catch {
        setChecked(true);
      }
    })();
  }, [surah, ayah]);

  const toggle = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/auth/login?redirect=/reader/${surah}#ayah-${ayah}`);
        return;
      }
      if (active) {
        await supabase
          .from("user_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("surah_id", surah)
          .eq("verse_id", ayah);
        setActive(false);
      } else {
        await supabase
          .from("user_bookmarks")
          .insert({ user_id: user.id, surah_id: surah, verse_id: ayah });
        setActive(true);
      }
    } catch {
      // abaikan
    }
  };

  if (!checked) return null;

  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? `Hapus penanda ayat ${ayah}` : `Tandai ayat ${ayah}`}
    >
      {active ? "🔖 Ditandai" : "🔖 Tandai"}
    </Button>
  );
}
