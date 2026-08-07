import type { Metadata } from "next";
import { ConfirmHandler } from "@/components/auth/ConfirmHandler";

export const metadata: Metadata = {
  title: "Konfirmasi Email — QalbiTahfidz",
  description:
    "Memverifikasi email untuk mengaktifkan akun QalbiTahfidz dan melanjutkan hafalan Al-Qur'an.",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <ConfirmHandler />
    </div>
  );
}
