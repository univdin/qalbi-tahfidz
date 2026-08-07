"use client";

import React, { useRef } from "react";

interface Props {
  studentName: string;
  badgeTitle: string;
  surahCompleted: string;
  streakDays: number;
}

export const ShareableProgressCard: React.FC<Props> = ({
  studentName,
  badgeTitle,
  surahCompleted,
  streakDays,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateAndDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, "#059669");
    grad.addColorStop(1, "#0284c7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(30, 30, 540, 340, 20);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("QalbiTahfidz Achievement", 60, 80);

    ctx.fillStyle = "#059669";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(studentName, 60, 140);

    ctx.fillStyle = "#475569";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Lencana: ${badgeTitle}`, 60, 190);
    ctx.fillText(`Hafalan: ${surahCompleted}`, 60, 230);
    ctx.fillText(`Streak Harian: ${streakDays} Hari`, 60, 270);

    const link = document.createElement("a");
    link.download = `pencapaian_${studentName.toLowerCase().replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <canvas ref={canvasRef} width={600} height={400} className="hidden" />
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Bagikan Pencapaian Hafalan
        </h3>
        <p className="text-xs text-slate-500">
          Buat kartu gambar pencapaian untuk dibagikan ke WhatsApp / Media Sosial
        </p>
      </div>
      <button
        type="button"
        onClick={generateAndDownloadImage}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full shadow transition-all"
      >
        Unduh Gambar Kartu Pencapaian
      </button>
    </div>
  );
};
