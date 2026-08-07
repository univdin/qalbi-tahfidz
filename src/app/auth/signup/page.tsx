import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Daftar — QalbiTahfidz",
  description:
    "Buat akun QalbiTahfidz untuk memulai hafalan Al-Qur'an anak dengan Metode Ummi, Tikrar, dan FSRS.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
          ق
        </span>
        <span className="text-lg font-bold tracking-tight">QalbiTahfidz</span>
      </Link>
      <AuthForm mode="signup" />
    </div>
  );
}
