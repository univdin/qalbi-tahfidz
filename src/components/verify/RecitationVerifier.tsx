"use client";

import { useRef, useState } from "react";
import { SURAHS, getSurahMeta } from "@/lib/surahs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const JUZ30 = SURAHS.filter((s) => s.number >= 78);

interface VerifyResult {
  transcribed: string;
  expected: string;
  score: number;
  verdict: string;
}

const VERDICT_LABEL: Record<string, { text: string; className: string }> = {
  lancar: {
    text: "Lancar — luar biasa! 🎉",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  cukup: {
    text: "Cukup — ulangi beberapa bagian lagi.",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  perlu_ulang: {
    text: "Perlu ulang — dengarkan murottal lalu coba lagi.",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export const RecitationVerifier: React.FC = () => {
  const [surahNumber, setSurahNumber] = useState(78);
  const [ayahStart, setAyahStart] = useState(1);
  const [ayahEnd, setAyahEnd] = useState(1);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const selectedSurah = getSurahMeta(surahNumber);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.start();
      setRecording(true);
      streamRef.current = stream;
    } catch {
      setError("Izin mikrofon ditolak atau perekaman gagal.");
    }
  };

  const stopAndVerify = async () => {
    if (!mediaRecorderRef.current) return;
    const recorder = mediaRecorderRef.current;
    setRecording(false);

    const blobPromise = new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      };
    });
    recorder.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    const audioBlob = await blobPromise;
    await submitAudio(audioBlob);
  };

  const submitAudio = async (audioBlob: Blob) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("audio", audioBlob, "recording.webm");
      form.append(
        "payload",
        JSON.stringify({
          surah: surahNumber,
          ayahStart: Math.min(ayahStart, ayahEnd),
          ayahEnd: Math.max(ayahStart, ayahEnd),
        })
      );

      const res = await fetch("/api/verify", { method: "POST", body: form });
      const json = (await res.json()) as VerifyResult & { error?: string };
      if (!res.ok || json.error) {
        setError(json.error ?? "Verifikasi gagal. Coba lagi.");
        return;
      }
      setResult(json);
    } catch {
      setError("Terjadi kesalahan jaringan saat verifikasi.");
    } finally {
      setUploading(false);
    }
  };

  const verdict =
    result && VERDICT_LABEL[result.verdict]
      ? VERDICT_LABEL[result.verdict]
      : null;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Verifikasi Bacaan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Rekam bacaan Anda lalu sistem akan membandingkannya dengan teks
          standar via AI speech recognition.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Ayat & Rekam</CardTitle>
          <CardDescription>
            Pastikan ruangan tenang dan posisikan mikrofon dekat.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Surah
              </label>
              <select
                value={surahNumber}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setSurahNumber(num);
                  setAyahStart(1);
                  setAyahEnd(1);
                }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <optgroup label="Juz 30">
                  {JUZ30.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.nameId}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Surah lainnya">
                  {SURAHS.filter((s) => s.number < 78).map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.nameId}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ayat mulai
              </label>
              <Input
                type="number"
                min={1}
                max={selectedSurah?.ayahCount ?? 1}
                value={ayahStart}
                onChange={(e) => setAyahStart(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ayat selesai
              </label>
              <Input
                type="number"
                min={1}
                max={selectedSurah?.ayahCount ?? 1}
                value={ayahEnd}
                onChange={(e) => setAyahEnd(Number(e.target.value))}
              />
            </div>
          </div>

          <Button
            onClick={recording ? stopAndVerify : startRecording}
            disabled={uploading}
            variant={recording ? "destructive" : "default"}
            className={`w-full gap-2 ${recording ? "" : ""}`}
          >
            {recording
              ? uploading
                ? "Memverifikasi…"
                : "⏹ Stop & Verifikasi"
              : "🎙 Mulai Rekam Bacaan"}
          </Button>

          {recording && !uploading && (
            <p className="animate-pulse text-center text-xs text-red-500">
              Sedang merekam… bacakan ayat dengan pelan dan jelas.
            </p>
          )}
          {uploading && (
            <p className="text-center text-xs text-slate-500">
              AI sedang menganalisis bacaan Anda…
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {result && verdict && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex flex-col items-center gap-3">
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${verdict.className}`}
              >
                {verdict.text}
              </span>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-slate-100 dark:border-slate-700">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                  {result.score}%
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hasil transkripsi
                </span>
                <p className="font-arabic text-lg leading-relaxed text-slate-800 dark:text-slate-100">
                  {result.transcribed}
                </p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Teks rujukan
                </span>
                <p className="font-arabic text-lg leading-relaxed text-emerald-900 dark:text-emerald-200">
                  {result.expected}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="w-full"
            >
              Verifikasi Ayat Lain
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
