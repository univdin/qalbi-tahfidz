"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseSmartQuery } from "@/lib/search-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Omnibox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSmartQuery(q);
    switch (parsed.type) {
      case "juz":
        router.push(`/juz/${parsed.juz}`);
        break;
      case "page":
        router.push(`/halaman/${parsed.page}`);
        break;
      case "surah_verse":
        router.push(`/reader/${parsed.surah}#ayah-${parsed.verse}`);
        break;
      case "surah":
        router.push(`/reader/${parsed.surah}`);
        break;
      case "keyword":
        router.push(`/cari?q=${encodeURIComponent(parsed.keyword)}`);
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Coba: juz 30 · halaman 150 · al baqarah 286 · yasin · maryam 19"
        className="h-11 flex-1"
        aria-label="Navigasi cepat Al-Qur'an"
      />
      <Button type="submit" className="h-11">
        Lompat
      </Button>
    </form>
  );
}
