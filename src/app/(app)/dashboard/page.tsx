import { ParentDashboard } from "@/components/dashboard/ParentDashboard";

export const metadata = {
  title: "Dashboard — QalbiTahfidz",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-6 py-8">
      <ParentDashboard />
    </div>
  );
}
