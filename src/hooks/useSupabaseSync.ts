"use client";

import { useEffect, useState, useCallback } from "react";
import { fsrs, generatorParameters, createEmptyCard } from "ts-fsrs";
import type { Card, Grade } from "ts-fsrs";
import { supabase } from "@/core/supabase/client";
import {
  enqueueSrsOutbox,
  getSrsOutboxEntries,
  removeSrsOutboxEntry,
} from "@/services/srsOutbox";

const fSrsScheduler = fsrs(
  generatorParameters({ request_retention: 0.9, enable_fuzz: true })
);

export type HifzCategory = "sabaq" | "sabqi" | "manzil";

export interface UserHifzCard {
  id: string;
  userId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  category: HifzCategory;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  dueDate: string;
  lastReviewedAt: string;
}

interface HifzCardRow {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_start: number;
  ayah_end: number;
  category: HifzCategory;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  due_date: string;
  last_reviewed_at: string;
}

function toUserCard(d: HifzCardRow): UserHifzCard {
  return {
    id: d.id,
    userId: d.user_id,
    surahNumber: d.surah_number,
    ayahStart: d.ayah_start,
    ayahEnd: d.ayah_end,
    category: d.category,
    stability: d.stability,
    difficulty: d.difficulty,
    elapsed_days: d.elapsed_days,
    scheduled_days: d.scheduled_days,
    reps: d.reps,
    lapses: d.lapses,
    state: d.state,
    dueDate: d.due_date,
    lastReviewedAt: d.last_reviewed_at,
  };
}

function toFsrsCard(doc: UserHifzCard): Card {
  return {
    due: new Date(doc.dueDate),
    stability: doc.stability,
    difficulty: doc.difficulty,
    elapsed_days: doc.elapsed_days,
    scheduled_days: doc.scheduled_days,
    reps: doc.reps,
    lapses: doc.lapses,
    state: doc.state,
    learning_steps: 0,
    last_review: new Date(doc.lastReviewedAt),
  };
}

async function getUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function isOfflineError(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.onLine === false
  );
}

export function useSupabaseSync() {
  const [cards, setCards] = useState<UserHifzCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [now] = useState(() => Date.now());

  const fetchCards = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("hifz_cards")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Supabase cards fetch error:", error);
    } else if (data) {
      setCards((data as HifzCardRow[]).map(toUserCard));
    }
    setLoading(false);
  }, []);

  const flushOutbox = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    const entries = await getSrsOutboxEntries();
    for (const entry of entries) {
      if (entry.op !== "upsert_hifz_card") continue;
      const { error } = await supabase.from("hifz_cards").upsert(entry.payload);
      if (error) {
        console.error("Outbox flush failed for entry:", entry.id, error);
        continue;
      }
      await removeSrsOutboxEntry(entry.id);
    }
    if (entries.length > 0) fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchCards();
      if (cancelled) return;
      await flushOutbox();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchCards, flushOutbox]);

  const reviewCardAction = useCallback(
    async (
      existingDoc: UserHifzCard | null,
      surahNumber: number,
      ayahStart: number,
      ayahEnd: number,
      rating: Grade
    ) => {
      const userId = await getUserId();
      if (!userId) throw new Error("User authentication required");

      const cardId = existingDoc
        ? existingDoc.id
        : `surah_${surahNumber}_${ayahStart}_${ayahEnd}`;
      const cardObj: Card = existingDoc ? toFsrsCard(existingDoc) : createEmptyCard();

      const schedulingCards = fSrsScheduler.repeat(cardObj, new Date());
      const resultCard = schedulingCards[rating].card;

      const payload = {
        id: cardId,
        user_id: userId,
        surah_number: surahNumber,
        ayah_start: ayahStart,
        ayah_end: ayahEnd,
        category: existingDoc ? existingDoc.category : ("sabaq" as const),
        stability: resultCard.stability,
        difficulty: resultCard.difficulty,
        elapsed_days: resultCard.elapsed_days,
        scheduled_days: resultCard.scheduled_days,
        reps: resultCard.reps,
        lapses: resultCard.lapses,
        state: resultCard.state,
        due_date: resultCard.due.toISOString(),
        last_reviewed_at: new Date().toISOString(),
      };

      const optimistic: UserHifzCard = {
        id: cardId,
        userId,
        surahNumber,
        ayahStart,
        ayahEnd,
        category: existingDoc ? existingDoc.category : "sabaq",
        stability: resultCard.stability,
        difficulty: resultCard.difficulty,
        elapsed_days: resultCard.elapsed_days,
        scheduled_days: resultCard.scheduled_days,
        reps: resultCard.reps,
        lapses: resultCard.lapses,
        state: resultCard.state,
        dueDate: resultCard.due.toISOString(),
        lastReviewedAt: new Date().toISOString(),
      };

      setCards((prev) => [
        ...prev.filter((c) => c.id !== cardId),
        optimistic,
      ]);

      const { error } = await supabase.from("hifz_cards").upsert(payload);
      if (error) {
        if (isOfflineError()) {
          console.warn("Offline — review masuk outbox lokal.");
          await enqueueSrsOutbox(payload);
          return;
        }
        console.error("Supabase card upsert failed:", error);
      } else {
        fetchCards();
      }
    },
    [fetchCards]
  );

  const createCardAction = useCallback(
    async (
      surahNumber: number,
      ayahStart: number,
      ayahEnd: number,
      category: HifzCategory = "sabaq"
    ) => {
      const userId = await getUserId();
      if (!userId) throw new Error("User authentication required");

      const cardId = `surah_${surahNumber}_${ayahStart}_${ayahEnd}`;
      const empty = createEmptyCard();

      const payload = {
        id: cardId,
        user_id: userId,
        surah_number: surahNumber,
        ayah_start: ayahStart,
        ayah_end: ayahEnd,
        category,
        stability: empty.stability,
        difficulty: empty.difficulty,
        elapsed_days: empty.elapsed_days,
        scheduled_days: empty.scheduled_days,
        reps: empty.reps,
        lapses: empty.lapses,
        state: empty.state,
        due_date: empty.due.toISOString(),
        last_reviewed_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("hifz_cards").upsert(payload);
      if (error) {
        if (isOfflineError()) {
          console.warn("Offline — kartu baru masuk outbox lokal.");
          await enqueueSrsOutbox(payload);
          return cardId;
        }
        console.error("Supabase card create failed:", error);
        throw error;
      }
      await fetchCards();
      return cardId;
    },
    [fetchCards]
  );

  useEffect(() => {
    const handleOnline = () => {
      flushOutbox();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [flushOutbox]);

  const dueCards = cards.filter(
    (c) => new Date(c.dueDate).getTime() <= now
  );

  return {
    cards,
    dueCards,
    loading,
    reviewCardAction,
    createCardAction,
    flushOutbox,
  };
}
