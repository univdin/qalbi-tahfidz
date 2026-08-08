"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PACKAGES = [
  { credits: 10, price: 5000 },
  { credits: 25, price: 12500 },
  { credits: 50, price: 25000 },
  { credits: 100, price: 50000 },
];

declare global {
  interface Window {
    snap?: { pay: (token: string, cb?: { onSuccess?: () => void; onPending?: () => void; onClose?: () => void }) => void };
  }
}

function loadSnapScript(clientKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const s = document.createElement("script");
    s.src = "https://app.midtrans.com/snap/snap.js";
    s.setAttribute("data-client-key", clientKey);
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Gagal memuat Snap"));
    document.body.appendChild(s);
  });
}

export function TopUpForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTopUp = async (credits: number) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/payments/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits }),
      });
      const json = (await res.json()) as { token?: string; clientKey?: string; error?: string };
      if (!res.ok || !json.token || !json.clientKey) {
        setError(json.error ?? "Gagal membuat transaksi.");
        return;
      }
      await loadSnapScript(json.clientKey);
      window.snap?.pay(json.token, {
        onSuccess: () => setMessage("Pembayaran berhasil. Kredit ditambahkan otomatis."),
        onPending: () => setMessage("Pembayaran menunggu konfirmasi."),
        onClose: () => setMessage("Pembayaran ditutup."),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Isi Ulang Kredit AI</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kredit dipakai untuk fitur Tanya Tafsir AI (1 pertanyaan = 1 kredit).
        </p>
        {PACKAGES.map((p) => (
          <Button
            key={p.credits}
            variant="outline"
            disabled={loading}
            onClick={() => handleTopUp(p.credits)}
            className="flex h-14 items-center justify-between px-4"
          >
            <span className="font-semibold">{p.credits} kredit</span>
            <span className="text-emerald-600">Rp {p.price.toLocaleString("id-ID")}</span>
          </Button>
        ))}
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {message}
          </p>
        )}
        <p className="text-[11px] text-slate-400">
          Pembayaran diproses oleh Midtrans (QRIS, GoPay, ShopeePay, VA Bank).
        </p>
      </CardContent>
    </Card>
  );
}
