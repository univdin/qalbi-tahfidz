"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import { useSession } from "@/hooks/useSession";

function timeSuggestion(): { title: string; surah?: number } {
  const h = new Date().getHours();
  if (h >= 4 && h < 10) return { title: "Selamat pagi! Waktunya menguatkan hafalan.", surah: 36 };
  if (h >= 10 && h < 15) return { title: "Siang yang baik. Sisihkan 5 menit untuk muroja'ah." };
  if (h >= 15 && h < 19) return { title: "Sore hari, sempurnakan target harianmu." };
  return { title: "Malam hari. Waktunya muraja'ah sebelum tidur.", surah: 67 };
}

export function GreetingCard() {
  const { user } = useSession();
  const [fullName, setFullName] = useState("");
  const suggestion = timeSuggestion();

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setFullName((data as { full_name?: string } | null)?.full_name ?? "");
    })();
  }, [user]);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
      <p className="text-sm text-emerald-100">Assalamu&apos;alaikum,</p>
      <h1 className="text-2xl font-bold">
        {fullName || (user?.email ? user.email.split("@")[0] : "Sahabat")}
      </h1>
      <p className="mt-2 text-sm text-emerald-50">{suggestion.title}</p>
      {suggestion.surah && (
        <Link
          href={`/reader/${suggestion.surah}`}
          className="mt-3 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
        >
          Buka sekarang →
        </Link>
      )}
    </div>
  );
}
