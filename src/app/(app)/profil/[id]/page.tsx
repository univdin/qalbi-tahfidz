import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/core/supabase/admin";
import { getSurahMeta } from "@/lib/surahs";
import { computeBadges, type Badge } from "@/lib/badges";
import { BadgeList } from "@/components/profile/BadgeList";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const admin = getAdminSupabase();
  const { data } = await admin
    .from("profiles")
    .select("full_name, is_public_profile")
    .eq("id", id)
    .maybeSingle();
  if (!data || !data.is_public_profile) {
    return { title: "Profil tidak ditemukan", robots: { index: false } };
  }
  return {
    title: `Profil Hafalan ${data.full_name} — QalbiTahfidz`,
    robots: { index: true, follow: false },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const admin = getAdminSupabase();

  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name, role, is_public_profile")
    .eq("id", id)
    .maybeSingle();

  if (!profile || !profile.is_public_profile) notFound();

  const [{ data: streak }, { data: cards }, { data: reflections }] =
    await Promise.all([
      admin
        .from("user_streaks")
        .select("current_streak, longest_streak, total_verses_memorized")
        .eq("user_id", id)
        .maybeSingle(),
      admin.from("hifz_cards").select("surah_number").eq("user_id", id),
      admin
        .from("ayah_reflections")
        .select("id")
        .eq("user_id", id)
        .eq("is_public", true),
    ]);

  const surahSet = new Set((cards ?? []).map((c) => c.surah_number as number));
  const surahs = [...surahSet].sort((a, b) => a - b);
  const badges: Badge[] = computeBadges({
    surahCount: surahs.length,
    streakDays: streak?.current_streak ?? 0,
    reflectionsCount: reflections?.length ?? 0,
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/60">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {profile.full_name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Portofolio hafalan Al-Qur&apos;an
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-600">
              {streak?.current_streak ?? 0}
            </p>
            <p className="text-xs text-slate-500">Streak hari</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">
              {streak?.total_verses_memorized ?? 0}
            </p>
            <p className="text-xs text-slate-500">Ayat dihafal</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{surahs.length}</p>
            <p className="text-xs text-slate-500">Surah</p>
          </div>
        </div>
      </div>

      <BadgeList badges={badges} />

      <div>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Surah yang dihafal ({surahs.length})
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {surahs.map((s) => {
            const meta = getSurahMeta(s);
            return (
              <Link
                key={s}
                href={`/reader/${s}`}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
              >
                {meta?.nameId ?? s}
              </Link>
            );
          })}
          {surahs.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada surah tercatat.</p>
          )}
        </div>
      </div>
    </div>
  );
}
