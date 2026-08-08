-- QalbiTahfidz — AI Tafsir credit system (H3B)
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT USING ((select auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.deduct_user_credit(
  p_user_id UUID,
  p_cost INT DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_balance INT;
BEGIN
  SELECT balance INTO v_balance FROM public.user_credits WHERE user_id = p_user_id;
  IF v_balance IS NULL OR v_balance < p_cost THEN
    RETURN FALSE;
  END IF;
  UPDATE public.user_credits
    SET balance = balance - p_cost, updated_at = NOW()
    WHERE user_id = p_user_id;
  RETURN TRUE;
END; $$;

-- 10 kredit gratis saat daftar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
    ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_streaks (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_credits (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
