import type { Metadata } from "next";
import { SrsDeck } from "@/components/deck/SrsDeck";
import { DashboardNav } from "@/components/nav/DashboardNav";

export const metadata: Metadata = {
  title: "Jadwal Ulangan Hafalan — QalbiTahfidz",
  description:
    "Jadwal ulangan hafalan (Sabaq, Sabqi & Manzil) berdasarkan kestabilan ingatan anak.",
  robots: { index: false, follow: false },
};

export default function DeckPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-8 pb-24 sm:pb-8">
      <DashboardNav />
      <SrsDeck />
    </div>
  );
}
