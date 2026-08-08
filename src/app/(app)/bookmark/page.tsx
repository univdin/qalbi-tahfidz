import type { Metadata } from "next";
import { BookmarkList } from "@/components/quran/BookmarkList";

export const metadata: Metadata = {
  title: "Penanda Ayat — QalbiTahfidz",
  robots: { index: false, follow: false },
};

export default function BookmarkPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Penanda Ayat
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ayat yang kamu tandai untuk diingat.
        </p>
      </div>
      <BookmarkList />
    </div>
  );
}
