"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import { absoluteUrl } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: absoluteUrl("/auth/update-password") }
    );
    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl">Cek Email Kamu 📬</CardTitle>
          <CardDescription>
            Link atur ulang kata sandi sudah dikirim ke{" "}
            <span className="font-semibold text-emerald-600">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            Buka kotak masuk (dan folder spam) lalu klik tautan untuk membuat
            kata sandi baru. Tautan berlaku hingga 24 jam.
          </p>
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            Kembali ke halaman masuk
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email akunmu. Kami akan mengirim link untuk mengatur ulang
          kata sandi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Mengirim…" : "Kirim Link Reset"}
          </Button>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Ingat kata sandi?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
