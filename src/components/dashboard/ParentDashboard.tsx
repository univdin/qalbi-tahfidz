"use client";

import { ProgressOverviewChart } from "@/components/dashboard/ProgressOverviewChart";
import { ChildLinkManager } from "@/components/dashboard/ChildLinkManager";
import { ShareableProgressCard } from "@/components/kids/ShareableProgressCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const ParentDashboard: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const {
    profile,
    currentStreak,
    longestStreak,
    totalVersesMemorized,
    badges,
    retentionRate,
    totalReviews,
    dueToday,
    dailyActivity,
    children,
    loading,
    error,
  } = useDashboardData(reloadKey);

  const latitude = profile?.latitude ?? -6.2088;
  const longitude = profile?.longitude ?? 106.8456;
  const prayerTimes = usePrayerTimes(latitude, longitude);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Memuat dashboard…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="max-w-md text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  const isGuardian =
    profile?.role === "parent" || profile?.role === "teacher";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Dashboard Hafalan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isGuardian
            ? "Pantau progres hafalan anak & siswa Anda."
            : `Halo, ${profile?.fullName ?? "Siswa"} — pantau progres hafalan Anda.`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Streak Harian
            </span>
            <span className="text-3xl font-bold text-emerald-600">
              {currentStreak} <span className="text-base">hari</span>
            </span>
            <span className="text-xs text-slate-400">
              Rekor: {longestStreak} hari
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ayat Dihafal
            </span>
            <span className="text-3xl font-bold text-teal-600">
              {totalVersesMemorized}
            </span>
            <span className="text-xs text-slate-400">
              Target: {profile?.targetDailyVerses ?? 10}/hari
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kartu Jatuh Tempo
            </span>
            <span className="text-3xl font-bold text-amber-500">{dueToday}</span>
            <span className="text-xs text-slate-400">SRS hari ini</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Memory Retention
            </span>
            <span className="text-3xl font-bold text-emerald-600">
              {retentionRate}%
            </span>
            <span className="text-xs text-slate-400">
              {totalReviews} ulasan tercatat
            </span>
          </CardContent>
        </Card>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Lencana:
          </span>
          {badges.map((b) => (
            <Badge key={b} variant="secondary">
              {b}
            </Badge>
          ))}
        </div>
      )}

      <ProgressOverviewChart data={dailyActivity} />

      <ChildLinkManager onChanged={() => setReloadKey((k) => k + 1)} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Waktu Salat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {(
              [
                ["Subuh", prayerTimes.fajr],
                ["Dzuhur", prayerTimes.dhuhr],
                ["Ashar", prayerTimes.asr],
                ["Maghrib", prayerTimes.maghrib],
                ["Isya", prayerTimes.isha],
              ] as const
            ).map(([name, time]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 dark:bg-slate-800/60"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {name}
                </span>
                <span className="text-sm font-bold text-emerald-600">{time}</span>
              </div>
            ))}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Arah kiblat: {prayerTimes.qiblaDirection}° · Salat berikutnya:{" "}
              {prayerTimes.nextPrayerName} {prayerTimes.nextPrayerTime}
            </p>
          </CardContent>
        </Card>

        <ShareableProgressCard
          studentName={profile?.fullName ?? "Anak"}
          badgeTitle={badges[0] ?? "Juz 30 Tahfidz"}
          surahCompleted={`${totalVersesMemorized} ayat`}
          streakDays={currentStreak}
        />
      </div>

      {isGuardian && children.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Anak Didik
          </h2>
          {children.map((c) => (
            <Card key={c.userId}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-50">
                    {c.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {c.totalCards} kartu · {c.dueToday} jatuh tempo
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                    Sabaq {c.sabaq}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    Sabqi {c.sabqi}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Manzil {c.manzil}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
};
