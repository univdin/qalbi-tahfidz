import type { Metadata } from "next";
import { RecitationVerifier } from "@/components/verify/RecitationVerifier";

export const metadata: Metadata = {
  title: "Verifikasi Bacaan — QalbiTahfidz",
  description:
    "Rekam dan periksa bacaan Al-Qur'an dengan AI (Cloudflare Workers AI + WebGPU) untuk umpan balik akurat per ayat.",
  robots: { index: false, follow: false },
};

export default function VerifyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-8">
      <RecitationVerifier />
    </div>
  );
}
