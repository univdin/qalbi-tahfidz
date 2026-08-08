import type { Metadata } from "next";
import { TopUpForm } from "@/components/payment/TopUpForm";

export const metadata: Metadata = {
  title: "Isi Ulang Kredit — QalbiTahfidz",
  robots: { index: false, follow: false },
};

export default function TopUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Isi Ulang Kredit
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tambah saldo untuk fitur AI Tafsir.
        </p>
      </div>
      <TopUpForm />
    </div>
  );
}
