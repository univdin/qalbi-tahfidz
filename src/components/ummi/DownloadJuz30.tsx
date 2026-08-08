"use client";

import { useState } from "react";
import { fetchDynamicSurah } from "@/services/quranDataService";
import { Button } from "@/components/ui/button";

const JUZ30 = Array.from({ length: 37 }, (_, i) => i + 78);

export function DownloadJuz30() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const handleDownload = async () => {
    setRunning(true);
    setDone(0);
    setMessage(null);
    for (let i = 0; i < JUZ30.length; i++) {
      try {
        await fetchDynamicSurah(JUZ30[i]);
      } catch {
        // lanjutkan; surah yang gagal akan dicoba ulang saat dibuka
      }
      setDone(i + 1);
    }
    setRunning(false);
    setMessage("Juz 30 tersimpan untuk dibaca offline. 🎉");
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Simpan seluruh Juz 30 (surah 78–114) ke perangkat agar bisa dibaca
        tanpa internet.
      </p>
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={running}
        className="w-fit"
      >
        {running ? `Menyimpan… ${done}/${JUZ30.length}` : "⬇ Unduh Juz 30 (Offline)"}
      </Button>
      {running && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(done / JUZ30.length) * 100}%` }}
          />
        </div>
      )}
      {message && (
        <p className="text-sm font-semibold text-emerald-600">{message}</p>
      )}
    </div>
  );
}
