"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/core/supabase/client";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/reader", label: "Murottal" },
  { href: "/ummi", label: "Metode Ummi" },
  { href: "/deck", label: "Hafalan" },
  { href: "/dashboard", label: "Pantauan" },
  { href: "/verify", label: "Verifikasi" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Qalbi<span className="text-emerald-600">Tahfidz</span>
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
          >
            {signingOut ? "Keluar..." : "Keluar"}
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Masuk
          </Link>
        )}
      </nav>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
