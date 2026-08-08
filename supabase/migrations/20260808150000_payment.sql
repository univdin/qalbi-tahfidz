-- QalbiTahfidz — Payment & top-up kredit AI (H3C)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_gateway VARCHAR(20) NOT NULL DEFAULT 'midtrans',
  gross_amount DECIMAL(12,2) NOT NULL,
  credits_added INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  snap_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own payments" ON public.payment_transactions;
CREATE POLICY "Users can manage own payments"
  ON public.payment_transactions FOR ALL USING ((select auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.add_user_credits(
  p_user_id UUID,
  p_amount INT
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance)
    VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
    DO UPDATE SET balance = public.user_credits.balance + p_amount, updated_at = NOW();
END; $$;
