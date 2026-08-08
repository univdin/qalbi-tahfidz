-- QalbiTahfidz — Profil publik & preferensi sinkron
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_public_profile BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS font_scale FLOAT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS theme TEXT;

-- Daftar surah dihafal bisa dibaca publik (service-role dipakai di halaman profil)
CREATE INDEX IF NOT EXISTS idx_hifz_cards_user_surah ON public.hifz_cards(user_id, surah_number);
