-- QalbiTahfidz — Quest progress (gamified hafalan Juz 30)
-- MOD-C1: hifdh quest pathway. Quest list diturunkan dari kode (src/lib/quests.ts);
-- tabel ini hanya menyimpan progres per siswa.

CREATE TABLE IF NOT EXISTS public.student_quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  surah_number INT NOT NULL,
  start_verse INT NOT NULL,
  end_verse INT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  stars_earned INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, quest_id)
);

ALTER TABLE public.student_quest_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own quest progress" ON public.student_quest_progress;
CREATE POLICY "Users can manage own quest progress"
  ON public.student_quest_progress
  FOR ALL USING ((select auth.uid()) = student_id);

CREATE INDEX IF NOT EXISTS idx_quest_progress_student
  ON public.student_quest_progress(student_id);
