-- QalbiTahfidz — Remediasi Database Advisor (lint) & optimasi RLS
-- Mengatasi temuan linter Supabase:
--   1. function_search_path_mutable  → set_updated_at
--   2. auth_rls_initplan             → auth.uid() dibungkus (select auth.uid())
--   3. multiple_permissive_policies  → konsolidasi policy yang redundan
--   4. unindexed_foreign_keys        → index pada kolom FK
-- Idempotent: aman dijalankan ulang.

-- 1) Function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2) & 3) RLS: initplan + konsolidasi

-- Profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Parents and Teachers can read linked child profile" ON public.profiles;

CREATE POLICY "Users can read own or linked child profile"
  ON public.profiles FOR SELECT USING (
    (select auth.uid()) = id
    OR EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = (select auth.uid()) AND child_id = public.profiles.id
    )
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Parent Child Links
DROP POLICY IF EXISTS "Parents and Teachers can manage links" ON public.parent_child_links;
CREATE POLICY "Parents and Teachers can manage links"
  ON public.parent_child_links FOR ALL USING ((select auth.uid()) = parent_id);

-- Hifz Cards (SELECT "own" direduksi: tercakup policy ALL own)
DROP POLICY IF EXISTS "Users can view own hifz cards" ON public.hifz_cards;
DROP POLICY IF EXISTS "Guardians can view linked child hifz cards" ON public.hifz_cards;
DROP POLICY IF EXISTS "Users can manage own hifz cards" ON public.hifz_cards;

CREATE POLICY "Guardians can view linked child hifz cards"
  ON public.hifz_cards FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = (select auth.uid()) AND child_id = public.hifz_cards.user_id
    )
  );

CREATE POLICY "Users can manage own hifz cards"
  ON public.hifz_cards FOR ALL USING ((select auth.uid()) = user_id);

-- Review Logs
DROP POLICY IF EXISTS "Users can view own review logs" ON public.review_logs;
DROP POLICY IF EXISTS "Guardians can view linked child review logs" ON public.review_logs;
DROP POLICY IF EXISTS "Users can insert own review logs" ON public.review_logs;

CREATE POLICY "Users can view own or linked child review logs"
  ON public.review_logs FOR SELECT USING (
    (select auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = (select auth.uid()) AND child_id = public.review_logs.user_id
    )
  );

CREATE POLICY "Users can insert own review logs"
  ON public.review_logs FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Streaks
DROP POLICY IF EXISTS "Users can manage own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Guardians can view linked child streaks" ON public.user_streaks;

CREATE POLICY "Users can manage own streaks"
  ON public.user_streaks FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Guardians can view linked child streaks"
  ON public.user_streaks FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = (select auth.uid()) AND child_id = public.user_streaks.user_id
    )
  );

-- Collections & Notes
DROP POLICY IF EXISTS "Users can manage own collections" ON public.user_collections;
CREATE POLICY "Users can manage own collections"
  ON public.user_collections FOR ALL USING ((select auth.uid()) = user_id);

-- Mistake Logs
DROP POLICY IF EXISTS "Users can manage own mistake logs" ON public.hafalan_mistake_logs;
CREATE POLICY "Users can manage own mistake logs"
  ON public.hafalan_mistake_logs FOR ALL USING ((select auth.uid()) = user_id);

-- 4) Index kolom FK (unindexed_foreign_keys)
CREATE INDEX IF NOT EXISTS idx_hifz_cards_user_id ON public.hifz_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_review_logs_user_id ON public.review_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON public.review_logs(card_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_links_parent_id ON public.parent_child_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_links_child_id ON public.parent_child_links(child_id);
CREATE INDEX IF NOT EXISTS idx_user_collections_user_id ON public.user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_hafalan_mistake_logs_user_id ON public.hafalan_mistake_logs(user_id);
