-- QalbiTahfidz — Bookmarks & Last Read (P2/P3)
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_id INT NOT NULL,
  verse_id INT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, surah_id, verse_id)
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users can manage own bookmarks"
  ON public.user_bookmarks FOR ALL USING ((select auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON public.user_bookmarks(user_id);

CREATE TABLE IF NOT EXISTS public.user_last_read (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_id INT NOT NULL,
  verse_id INT NOT NULL,
  page_id INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_last_read ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own last read" ON public.user_last_read;
CREATE POLICY "Users can manage own last read"
  ON public.user_last_read FOR ALL USING ((select auth.uid()) = user_id);
