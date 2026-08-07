"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
          <CardContent className="h-64" />
        </Card>
      }
    >
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}

function AuthFormInner({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/reader/1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirect);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: fullName || email.split("@")[0],
          });
          if (profileError && profileError.code !== "23505") {
            console.warn("Profile upsert skipped:", profileError.message);
          }
        }
        router.push("/reader/1");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl">
          {isLogin ? "Masuk ke QalbiTahfidz" : "Buat Akun QalbiTahfidz"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "Lanjutkan hafalanmu. Sambungkan surah terakhir dan jadwal SRS."
            : "Daftar untuk memulai perjalanan menghafal Al-Qur'an."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Contoh: Ahmad Rizki"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Kata Sandi</Label>
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

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading
              ? "Memproses..."
              : isLogin
                ? "Masuk"
                : "Daftar & Mulai"}
          </Button>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {isLogin ? (
              <>
                Belum punya akun?{" "}
                <Link
                  href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  Daftar
                </Link>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  Masuk
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
