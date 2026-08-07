"use client";

import React, { useState, useRef } from "react";
import { openDB } from "idb";

interface RecitationRecorderProps {
  surahNumber: number;
  ayahNumber: number;
  masterAudioUrl: string;
}

export const RecitationRecorder: React.FC<RecitationRecorderProps> = ({
  surahNumber,
  ayahNumber,
  masterAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<"A" | "B">("A");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const blobUrl = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(blobUrl);

        const db = await openDB("QalbiTahfidzProductionDB", 1);
        await db.put("audio_recordings", audioBlob, `rec_${surahNumber}_${ayahNumber}`);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone permission or recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Latihan Suara (Self-Review A/B)
        </span>
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-full font-bold text-white text-sm transition-all shadow ${
            isRecording ? "bg-red-600 animate-pulse" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isRecording ? "Stop Rekaman" : "Mulai Rekam Suara"}
        </button>
      </div>

      {recordedBlobUrl && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTrack("A")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTrack === "A" ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              Track A: Suaraku
            </button>
            <button
              type="button"
              onClick={() => setActiveTrack("B")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTrack === "B" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              Track B: Qari Master (Ummi)
            </button>
          </div>

          <audio
            src={activeTrack === "A" ? recordedBlobUrl : masterAudioUrl}
            controls
            className="w-full h-8"
          />
        </div>
      )}
    </div>
  );
};
