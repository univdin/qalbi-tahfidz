import type { Metadata } from "next";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";
import { GreetingCard } from "@/components/dashboard/GreetingCard";
import { DashboardNav } from "@/components/nav/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard — QalbiTahfidz",
  description:
    "Pantau progres hafalan Al-Qur'an anak secara real-time: kartu SRS, streak, dan ringkasan prestasi.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 pb-24 sm:pb-8">
      <DashboardNav />
      <GreetingCard />
      <ParentDashboard />
    </div>
  );
}
