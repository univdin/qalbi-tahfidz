"use client";

import Link from "next/link";
import { useLastRead } from "@/hooks/useLastRead";

export function ResumeReading() {
  const { lastRead } = useLastRead();

  if (!lastRead) return null;

  return (
    <Link
      href={`/reader/${lastRead.surah_id}#ayah-${lastRead.verse_id}`}
      className="inline-flex h-10 items-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
    >
      ▶ Lanjutkan membaca
    </Link>
  );
}
