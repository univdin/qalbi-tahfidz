"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/core/supabase/client";
import type { Quest } from "@/lib/quests";

export interface QuestProgress {
  questId: string;
  stars: number;
  completedAt: string;
}

interface Row {
  quest_id: string;
  stars_earned: number;
  completed_at: string;
}

export function useQuestProgress() {
  const [progress, setProgress] = useState<Record<string, QuestProgress>>({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (cancelled) return;
        setUserId(user?.id ?? null);
        if (!user) {
          setLoading(false);
          return;
        }
        return supabase
          .from("student_quest_progress")
          .select("quest_id, stars_earned, completed_at")
          .eq("student_id", user.id)
          .then(({ data, error }) => {
            if (cancelled) return;
            if (!error && data) {
              const map: Record<string, QuestProgress> = {};
              for (const r of data as Row[]) {
                map[r.quest_id] = {
                  questId: r.quest_id,
                  stars: r.stars_earned,
                  completedAt: r.completed_at,
                };
              }
              setProgress(map);
            }
            setLoading(false);
          });
      })
      .catch(() => {
        if (!cancelled) {
          setUserId(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const completeQuest = useCallback(
    async (quest: Quest, stars: number) => {
      if (!userId) return;
      setProgress((prev) => ({
        ...prev,
        [quest.id]: {
          questId: quest.id,
          stars,
          completedAt: new Date().toISOString(),
        },
      }));
      await supabase.from("student_quest_progress").upsert({
        student_id: userId,
        quest_id: quest.id,
        surah_number: quest.surah,
        start_verse: quest.start,
        end_verse: quest.end,
        is_completed: true,
        stars_earned: stars,
        completed_at: new Date().toISOString(),
      });
    },
    [userId]
  );

  return { progress, loading, completeQuest };
}
