"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Brain,
  Mic,
  BookHeart,
  Bookmark,
  Bot,
  CreditCard,
  Flag,
} from "lucide-react";

const DASHBOARD_SUBMENU = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/quest", label: "Quest Juz Amma", icon: Flag },
  { href: "/deck", label: "Ulangan Hafalan", icon: Brain },
  { href: "/verify", label: "Verifikasi Suara", icon: Mic },
  { href: "/amalan", label: "Amalan Harian", icon: BookHeart },
  { href: "/bookmark", label: "Penanda Ayat", icon: Bookmark },
  { href: "/tafsir-ai", label: "Tafsir AI", icon: Bot },
  { href: "/dashboard/topup", label: "Topup Kredit", icon: CreditCard },
];

export function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <div className="mb-6 w-full border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DASHBOARD_SUBMENU.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all",
                active
                  ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-600 dark:text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
