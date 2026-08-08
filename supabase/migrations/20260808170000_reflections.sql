-- QalbiTahfidz — Tadabbur (refleksi ayat) & like
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.ayah_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_id INT NOT NULL,
  verse_id INT NOT NULL,
  text TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ayah_reflections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read public reflections" ON public.ayah_reflections;
CREATE POLICY "Anyone can read public reflections"
  ON public.ayah_reflections FOR SELECT USING (
    (is_public = true) OR ((select auth.uid()) = user_id)
  );
DROP POLICY IF EXISTS "Users can manage own reflections" ON public.ayah_reflections;
CREATE POLICY "Users can manage own reflections"
  ON public.ayah_reflections FOR ALL USING ((select auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_ayah_reflections_verse ON public.ayah_reflections(surah_id, verse_id);

CREATE TABLE IF NOT EXISTS public.reflection_likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reflection_id UUID NOT NULL REFERENCES public.ayah_reflections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, reflection_id)
);

ALTER TABLE public.reflection_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own reflection likes" ON public.reflection_likes;
CREATE POLICY "Users can manage own reflection likes"
  ON public.reflection_likes FOR ALL USING ((select auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.toggle_reflection_like(p_reflection_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID;
  v_count INT;
BEGIN
  SELECT auth.uid() INTO v_user;
  IF v_user IS NULL THEN RETURN -1; END IF;

  IF EXISTS (
    SELECT 1 FROM public.reflection_likes
    WHERE user_id = v_user AND reflection_id = p_reflection_id
  ) THEN
    DELETE FROM public.reflection_likes
      WHERE user_id = v_user AND reflection_id = p_reflection_id;
    UPDATE public.ayah_reflections SET likes = GREATEST(likes - 1, 0) WHERE id = p_reflection_id;
  ELSE
    INSERT INTO public.reflection_likes (user_id, reflection_id)
      VALUES (v_user, p_reflection_id) ON CONFLICT DO NOTHING;
    UPDATE public.ayah_reflections SET likes = likes + 1 WHERE id = p_reflection_id;
  END IF;

  SELECT likes INTO v_count FROM public.ayah_reflections WHERE id = p_reflection_id;
  RETURN COALESCE(v_count, 0);
END; $$;
