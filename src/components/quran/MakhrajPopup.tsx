"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MAKHRAJ_ZONES, type MakhrajZone } from "@/lib/makhraj";
import { Button } from "@/components/ui/button";

const Makhraj3D = dynamic(
  () => import("@/components/quran/Makhraj3D").then((m) => m.Makhraj3D),
  { ssr: false, loading: () => <p className="py-10 text-center text-sm text-slate-500">Memuat model 3D…</p> }
);

interface Props {
  zone: MakhrajZone | null;
  onClose: () => void;
}

export function MakhrajPopup({ zone, onClose }: Props) {
  const [show3d, setShow3d] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Diagram Makhraj"
    >
      <div
        className="w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Makhraj Huruf
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-slate-400 hover:text-slate-600"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <svg viewBox="0 0 100 100" className="mt-2 w-full" role="img" aria-label="Diagram titik artikulasi huruf (17 makhraj)">
          <path
            d="M 20 15 C 40 5, 60 8, 68 12 C 72 14, 74 20, 72 26 C 84 26, 90 32, 90 38 C 90 44, 84 46, 80 46 C 84 52, 84 58, 78 60 C 72 72, 60 80, 50 82 C 30 84, 20 70, 18 50 C 17 40, 18 25, 20 15 Z"
            fill="#f4f4f5"
            stroke="#a1a1aa"
            strokeWidth="1"
          />
          <path
            d="M 40 54 C 55 45, 68 42, 74 44 L 72 55 C 60 59, 48 61, 40 57 Z"
            fill="#e4e4e7"
            stroke="#a1a1aa"
            strokeWidth="0.6"
          />
          <path
            d="M 64 12 L 72 14 C 76 15, 78 18, 77 22 C 68 18, 62 15, 64 12 Z"
            fill="#d4d4d8"
            opacity="0.8"
          />
          {MAKHRAJ_ZONES.map((z, i) => {
            const active = zone?.id === z.id;
            return (
              <g key={z.id}>
                <circle
                  cx={z.x}
                  cy={z.y}
                  r={active ? 3.4 : 2.4}
                  fill={z.color}
                  stroke={active ? "#fff" : "none"}
                  strokeWidth={active ? 1 : 0}
                  opacity={active ? 1 : 0.85}
                />
                <text
                  x={z.x}
                  y={z.y + 0.8}
                  textAnchor="middle"
                  fontSize={active ? 2.8 : 2.2}
                  fill="#fff"
                  fontWeight="bold"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {MAKHRAJ_ZONES.map((z, i) => (
            <span
              key={z.id}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                zone?.id === z.id
                  ? "ring-2 ring-offset-1 ring-slate-400"
                  : ""
              }`}
              style={{ backgroundColor: `${z.color}22`, color: z.color }}
            >
              {i + 1}. {z.name}
            </span>
          ))}
        </div>

        {zone && (
          <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              {zone.nameAr}
            </p>
            <p className="text-sm font-bold text-emerald-600">{zone.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              Huruf: <span className="font-arabic text-base">{zone.letters}</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {zone.desc}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShow3d((v) => !v)}
            className="flex-1"
          >
            {show3d ? "Tutup 3D" : "🎥 Lihat 3D"}
          </Button>
        </div>
        {show3d && <Makhraj3D activeZoneId={zone?.id} />}
      </div>
    </div>
  );
}
