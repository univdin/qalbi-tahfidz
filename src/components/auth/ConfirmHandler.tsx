"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/core/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ConfirmStatus = "processing" | "success" | "error";

function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/reader/1";
  const [status, setStatus] = useState<ConfirmStatus>("processing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const failTimer = setTimeout(() => {
      if (cancelled) return;
      setStatus((current) =>
        current === "processing" ? "error" : current
      );
      setMessage(
        "Tautan konfirmasi mungkin sudah kadaluarsa atau tidak valid. Coba kirim ulang email konfirmasi."
      );
    }, 12000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event !== "SIGNED_IN") return;
      setStatus("success");
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState(null, "", url.toString());
      }
      router.replace(redirect);
    });

    const errorFromHash =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.hash.slice(1)).get("error")
        : null;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return;
        if (session) {
          setStatus("success");
          router.replace(redirect);
          return;
        }
        if (errorFromHash) {
          setStatus("error");
          setMessage(decodeURIComponent(errorFromHash));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setMessage("Gagal memverifikasi email. Coba lagi.");
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(failTimer);
      subscription.unsubscribe();
    };
  }, [redirect, router]);

  if (status === "success") {
    return (
      <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl">Email Terverifikasi ✅</CardTitle>
          <CardDescription>
            Akun kamu aktif. Mengalihkan kamu…
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={redirect}
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            Lanjutkan ke {redirect}
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl">Konfirmasi Gagal</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Masuk
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl">Memverifikasi Email…</CardTitle>
        <CardDescription>
          Memproses link konfirmasi kamu, sebentar lagi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </CardContent>
    </Card>
  );
}

export function ConfirmHandler() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md border-zinc-200 shadow-sm dark:border-zinc-800">
          <CardContent className="h-48" />
        </Card>
      }
    >
      <ConfirmInner />
    </Suspense>
  );
}
