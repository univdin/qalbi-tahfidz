"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/core/supabase/client";
import { useSession } from "@/hooks/useSession";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { Search, BookOpen, Baby, BookMarked, LayoutDashboard } from "lucide-react";

const NAV_ITEMS = [
  { href: "/reader", label: "Murottal", icon: BookOpen },
  { href: "/ummi", label: "Metode Ummi", icon: Baby },
  { href: "/kisah", label: "Kisah", icon: BookMarked },
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
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
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white shadow-sm">
              ق
            </span>
            <span className="text-zinc-900 dark:text-zinc-50">
              Qalbi<span className="text-emerald-600">Tahfidz</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  isActive(item.href)
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/cari"
              aria-label="Cari ayat"
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <Search className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
              >
                {signingOut ? "Keluar…" : "Keluar"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Masuk
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/90 p-1.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:hidden">
        <nav className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-center transition-colors",
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

