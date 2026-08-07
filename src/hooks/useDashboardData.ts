"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/core/supabase/client";

export interface DashboardProfile {
  id: string;
  fullName: string;
  role: "student" | "parent" | "teacher";
  targetDailyVerses: number;
  preferredScript: string;
  preferredMaskingMode: string;
  ageGroup: string;
  latitude: number;
  longitude: number;
}

export interface ChildSummary {
  userId: string;
  fullName: string;
  totalCards: number;
  dueToday: number;
  reps: number;
  lapses: number;
  sabaq: number;
  sabqi: number;
  manzil: number;
}

export interface DailyActivityPoint {
  day: string;
  sabaq: number;
  sabqi: number;
  manzil: number;
}

export interface DashboardData {
  profile: DashboardProfile | null;
  currentStreak: number;
  longestStreak: number;
  totalVersesMemorized: number;
  badges: string[];
  retentionRate: number;
  totalReviews: number;
  dueToday: number;
  dailyActivity: DailyActivityPoint[];
  children: ChildSummary[];
  loading: boolean;
  error: string | null;
}

interface ReviewLogRow {
  rating: number;
  reviewed_at: string;
  card_id: string;
}

interface HifzCardRow {
  id: string;
  category: string;
  user_id: string;
  due_date: string;
  reps: number;
  lapses: number;
}

interface ProfileRow {
  id: string;
  full_name: string;
  role: string;
  target_daily_verses: number;
  preferred_script: string;
  preferred_masking_mode: string;
  age_group: string;
  latitude: number;
  longitude: number;
}

interface StreakRow {
  current_streak: number;
  longest_streak: number;
  total_verses_memorized: number;
  badges_earned: string[];
}

const DAY_MS = 86_400_000;

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY_MS);
    days.push(
      d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
    );
  }
  return days;
}

export function useDashboardData(reloadKey = 0): DashboardData {
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalVersesMemorized, setTotalVersesMemorized] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [retentionRate, setRetentionRate] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [dueToday, setDueToday] = useState(0);
  const [dailyActivity, setDailyActivity] = useState<DailyActivityPoint[]>([]);
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const aggregateUser = useCallback(async (userId: string) => {
    const [profileRes, cardsRes, reviewsRes, streakRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("hifz_cards").select("*").eq("user_id", userId),
      supabase
        .from("review_logs")
        .select("rating, reviewed_at, card_id")
        .eq("user_id", userId),
      supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    const profileRow = profileRes.data as ProfileRow | null;
    const cardRows = (cardsRes.data ?? []) as HifzCardRow[];
    const reviewRows = (reviewsRes.data ?? []) as ReviewLogRow[];
    const streakRow = streakRes.data as StreakRow | null;

    const catById = new Map(cardRows.map((c) => [c.id, c.category]));

    const dayLabels = lastNDays(7);
    const buckets = new Map(
      dayLabels.map((label) => [label, { sabaq: 0, sabqi: 0, manzil: 0 }])
    );
    reviewRows.forEach((r) => {
      const label = new Date(r.reviewed_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      const bucket = buckets.get(label);
      if (!bucket) return;
      const category = catById.get(r.card_id) ?? "sabaq";
      if (category === "sabqi") bucket.sabqi += 1;
      else if (category === "manzil") bucket.manzil += 1;
      else bucket.sabaq += 1;
    });

    return {
      profileRow,
      cardRows,
      reviewRows,
      streakRow,
      dailyActivity: dayLabels.map((day) => ({ day, ...buckets.get(day)! })),
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    let userId: string | null = null;

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (cancelled) return;
        if (!user) {
          setLoading(false);
          return;
        }
        userId = user.id;
        return aggregateUser(user.id);
      })
      .then(async (own) => {
        if (cancelled || !own || !userId) return;

        const { profileRow, cardRows, reviewRows, streakRow, dailyActivity } =
          own;

        const ownSummary = {
          userId,
          fullName: profileRow?.full_name ?? "Siswa",
          totalCards: cardRows.length,
          dueToday: cardRows.filter(
            (c) => new Date(c.due_date).getTime() <= Date.now()
          ).length,
          reps: cardRows.reduce((acc, c) => acc + c.reps, 0),
          lapses: cardRows.reduce((acc, c) => acc + c.lapses, 0),
          sabaq: cardRows.filter((c) => c.category === "sabaq").length,
          sabqi: cardRows.filter((c) => c.category === "sabqi").length,
          manzil: cardRows.filter((c) => c.category === "manzil").length,
        };

        setProfile(
          profileRow
            ? {
                id: profileRow.id,
                fullName: profileRow.full_name,
                role: (profileRow.role as DashboardProfile["role"]) ?? "student",
                targetDailyVerses: profileRow.target_daily_verses ?? 10,
                preferredScript: profileRow.preferred_script ?? "indopak",
                preferredMaskingMode:
                  profileRow.preferred_masking_mode ?? "full",
                ageGroup: profileRow.age_group ?? "junior",
                latitude: profileRow.latitude ?? -6.2088,
                longitude: profileRow.longitude ?? 106.8456,
              }
            : null
        );
        setCurrentStreak(streakRow?.current_streak ?? 0);
        setLongestStreak(streakRow?.longest_streak ?? 0);
        setTotalVersesMemorized(streakRow?.total_verses_memorized ?? 0);
        setBadges(streakRow?.badges_earned ?? []);
        setDueToday(ownSummary.dueToday);
        setTotalReviews(reviewRows.length);
        setRetentionRate(
          reviewRows.length > 0
            ? Math.round(
                (reviewRows.filter((r) => r.rating >= 3).length /
                  reviewRows.length) *
                  100
              )
            : 0
        );
        setDailyActivity(dailyActivity);

        const isGuardian =
          profileRow?.role === "parent" || profileRow?.role === "teacher";

        if (!isGuardian) {
          setLoading(false);
          return;
        }

        const { data: links, error: linksError } = await supabase
          .from("parent_child_links")
          .select("child_id")
          .eq("parent_id", profileRow.id);
        if (cancelled) return;
        if (linksError) {
          setError(linksError.message);
          setLoading(false);
          return;
        }
        const childIds = (links ?? []).map((l) => l.child_id as string);
        const childSummaries = await Promise.all(
          childIds.map(async (childId) => {
            const agg = await aggregateUser(childId);
            return {
              userId: childId,
              fullName: agg.profileRow?.full_name ?? "Anak",
              totalCards: agg.cardRows.length,
              dueToday: agg.cardRows.filter(
                (c) => new Date(c.due_date).getTime() <= Date.now()
              ).length,
              reps: agg.cardRows.reduce((acc, c) => acc + c.reps, 0),
              lapses: agg.cardRows.reduce((acc, c) => acc + c.lapses, 0),
              sabaq: agg.cardRows.filter((c) => c.category === "sabaq").length,
              sabqi: agg.cardRows.filter((c) => c.category === "sabqi").length,
              manzil: agg.cardRows.filter((c) => c.category === "manzil")
                .length,
            };
          })
        );
        if (cancelled) return;
        setChildren(childSummaries);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Gagal memuat dashboard");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aggregateUser, reloadKey]);

  return {
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
  };
}
