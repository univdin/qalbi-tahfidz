import type { Metadata } from "next";
import { RecitationVerifier } from "@/components/verify/RecitationVerifier";
import { DashboardNav } from "@/components/nav/DashboardNav";

export const metadata: Metadata = {
  title: "Verifikasi Bacaan — QalbiTahfidz",
  description:
    "Rekam dan periksa bacaan Al-Qur'an secara otomatis untuk umpan balik akurat per ayat.",
  robots: { index: false, follow: false },
};

export default function VerifyPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-8 pb-24 sm:pb-8">
      <DashboardNav />
      <RecitationVerifier />
    </div>
  );
}
