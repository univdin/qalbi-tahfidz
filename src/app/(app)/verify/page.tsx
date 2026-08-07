import { RecitationVerifier } from "@/components/verify/RecitationVerifier";

export const metadata = {
  title: "Verifikasi Bacaan — QalbiTahfidz",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-8">
      <RecitationVerifier />
    </div>
  );
}
