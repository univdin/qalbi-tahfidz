"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import { absoluteUrl } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "signup";
}

function isEmailNotConfirmed(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: string }).code;
  const message = (error as { message?: string }).message ?? "";
  return (
    code === "email_not_confirmed" ||
    message.toLowerCase().includes("email not confirmed")
  );
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
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const isLogin = mode === "login";

  const handleResendConfirmation = async (targetEmail: string) => {
    setResending(true);
    setResendStatus(null);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: targetEmail,
      options: { emailRedirectTo: absoluteUrl("/auth/confirm") },
    });
    if (resendError) {
      setResendStatus(`Gagal mengirim ulang: ${resendError.message}`);
    } else {
      setResendStatus("Email konfirmasi terkirim. Periksa kotak masuk & spam.");
    }
    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) {
          if (isEmailNotConfirmed(loginError)) {
            setConfirmationEmail(email);
            return;
          }
          throw loginError;
        }
        router.push(redirect);
        router.refresh();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: absoluteUrl("/auth/confirm"),
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          router.push(redirect);
          router.refresh();
        } else {
          setSignedUpEmail(email);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  if (signedUpEmail) {
    return (
      <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl">Cek Email Kamu 📬</CardTitle>
          <CardDescription>
            Kami telah mengirim link konfirmasi ke{" "}
            <span className="font-semibold text-emerald-600">{signedUpEmail}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Buka kotak masuk email kamu.</li>
            <li>Klik tombol &quot;Konfirmasi Email&quot;.</li>
            <li>Kembali ke sini dan masuk.</li>
          </ol>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tidak sampai? Cek folder spam / promosi. Link berlaku hingga 24 jam.
          </p>

          {resendStatus && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {resendStatus}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            disabled={resending}
            onClick={() => handleResendConfirmation(signedUpEmail)}
          >
            {resending ? "Mengirim…" : "Kirim Ulang Email Konfirmasi"}
          </Button>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Sudah mengonfirmasi?{" "}
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-emerald-600 hover:underline"
            >
              Masuk sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

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

          {isLogin && (
            <Link
              href="/auth/forgot-password"
              className="text-right text-xs font-medium text-emerald-600 hover:underline"
            >
              Lupa password?
            </Link>
          )}

          {confirmationEmail && (
            <div className="flex flex-col gap-2 rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-950/50">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Email kamu belum dikonfirmasi. Klik link yang kami kirim ke{" "}
                <span className="font-semibold">{confirmationEmail}</span> sebelum
                masuk.
              </p>
              {resendStatus && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {resendStatus}
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={resending}
                onClick={() => handleResendConfirmation(confirmationEmail)}
              >
                {resending ? "Mengirim…" : "Kirim Ulang Email Konfirmasi"}
              </Button>
            </div>
          )}

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
