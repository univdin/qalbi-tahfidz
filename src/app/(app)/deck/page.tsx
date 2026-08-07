import type { Metadata } from "next";
import { SrsDeck } from "@/components/deck/SrsDeck";

export const metadata: Metadata = {
  title: "SRS Deck — QalbiTahfidz",
  description:
    "Jadwal ulangan berjarak (FSRS) untuk Sabaq, Sabqi & Manzil hafalan Al-Qur'anmu.",
  robots: { index: false, follow: false },
};

export default function DeckPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-8">
      <SrsDeck />
    </div>
  );
}
