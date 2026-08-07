"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/core/supabase/client";
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

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("access_token")) {
      void supabase.auth.getSession();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/auth/login"), 1800);
  };

  if (done) {
    return (
      <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl">Kata Sandi Diperbarui ✅</CardTitle>
          <CardDescription>
            Kata sandi baru sudah disimpan. Mengalihkan ke halaman masuk…
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl">Buat Kata Sandi Baru</CardTitle>
        <CardDescription>
          Masukkan kata sandi baru untuk akunmu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Kata Sandi Baru</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Menyimpan…" : "Simpan Kata Sandi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
