-- QalbiTahfidz — Database Schema (PostgreSQL)
-- Sumber: docs/quran/master.md §3 (QURAN master spec)
-- Jalankan via: supabase db execute --file supabase/schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (terhubung auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'parent', 'teacher')) DEFAULT 'student',
  target_daily_verses INT DEFAULT 10,
  preferred_qari TEXT DEFAULT 'murottal_ummi_nahawand',
  preferred_script TEXT CHECK (preferred_script IN ('uthmani', 'indopak')) DEFAULT 'indopak',
  preferred_masking_mode TEXT DEFAULT 'full',
  age_group TEXT CHECK (age_group IN ('early_child', 'junior', 'teen_adult')) DEFAULT 'junior',
  latitude FLOAT DEFAULT -6.2088,
  longitude FLOAT DEFAULT 106.8456,
  prayer_calc_method TEXT DEFAULT 'Kemenag',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parent/Teacher – Child Links
CREATE TABLE public.parent_child_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('parent', 'teacher')) DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- 3. Hifz Cards (FSRS-Compatible SRS)
CREATE TABLE public.hifz_cards (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number INT NOT NULL,
  ayah_start INT NOT NULL,
  ayah_end INT NOT NULL,
  category TEXT CHECK (category IN ('sabaq', 'sabqi', 'manzil')) DEFAULT 'sabaq',
  stability FLOAT NOT NULL DEFAULT 0.0,
  difficulty FLOAT NOT NULL DEFAULT 0.0,
  elapsed_days INT NOT NULL DEFAULT 0,
  scheduled_days INT NOT NULL DEFAULT 0,
  reps INT NOT NULL DEFAULT 0,
  lapses INT NOT NULL DEFAULT 0,
  state INT NOT NULL DEFAULT 0,
  due_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hifz_cards_user_due ON public.hifz_cards(user_id, due_date);

-- 4. Review Logs
CREATE TABLE public.review_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id TEXT NOT NULL REFERENCES public.hifz_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 4) NOT NULL,
  listened_repeats INT DEFAULT 1,
  duration_seconds INT DEFAULT 0,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_review_logs_user_date ON public.review_logs(user_id, reviewed_at);

-- 5. Streaks & Gamification
CREATE TABLE public.user_streaks (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_verses_memorized INT DEFAULT 0,
  badges_earned JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notes & Bookmarks
CREATE TABLE public.user_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number INT NOT NULL,
  ayah_number INT NOT NULL,
  collection_name TEXT DEFAULT 'Favorites',
  personal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Hafalan Mistake Logs (Heatmap Error Analysis)
CREATE TABLE public.hafalan_mistake_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number INT NOT NULL,
  ayah_number INT NOT NULL,
  word_position INT,
  mistake_type TEXT CHECK (mistake_type IN ('forget_word', 'tajweed', 'harkat', 'skip_verse')) DEFAULT 'forget_word',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ RLS ============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hifz_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hafalan_mistake_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Parents and Teachers can read linked child profile"
  ON public.profiles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = auth.uid() AND child_id = public.profiles.id
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Parent Child Links
CREATE POLICY "Parents and Teachers can manage links"
  ON public.parent_child_links FOR ALL USING (auth.uid() = parent_id);

-- Hifz Cards
CREATE POLICY "Users can view own hifz cards"
  ON public.hifz_cards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Guardians can view linked child hifz cards"
  ON public.hifz_cards FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = auth.uid() AND child_id = public.hifz_cards.user_id
    )
  );

CREATE POLICY "Users can manage own hifz cards"
  ON public.hifz_cards FOR ALL USING (auth.uid() = user_id);

-- Review Logs
CREATE POLICY "Users can view own review logs"
  ON public.review_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Guardians can view linked child review logs"
  ON public.review_logs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = auth.uid() AND child_id = public.review_logs.user_id
    )
  );

CREATE POLICY "Users can insert own review logs"
  ON public.review_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks
CREATE POLICY "Users can manage own streaks"
  ON public.user_streaks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Guardians can view linked child streaks"
  ON public.user_streaks FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = auth.uid() AND child_id = public.user_streaks.user_id
    )
  );

-- Collections & Notes
CREATE POLICY "Users can manage own collections"
  ON public.user_collections FOR ALL USING (auth.uid() = user_id);

-- Mistake Logs
CREATE POLICY "Users can manage own mistake logs"
  ON public.hafalan_mistake_logs FOR ALL USING (auth.uid() = user_id);
