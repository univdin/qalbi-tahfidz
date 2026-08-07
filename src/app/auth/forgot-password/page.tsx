import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Password — QalbiTahfidz",
  description:
    "Atur ulang kata sandi akun QalbiTahfidz melalui email untuk melanjutkan hafalan Al-Qur'an.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
          ق
        </span>
        <span className="text-lg font-bold tracking-tight">QalbiTahfidz</span>
      </Link>
      <ForgotPasswordForm />
    </div>
  );
}
