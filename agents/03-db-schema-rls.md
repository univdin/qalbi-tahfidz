# 03 — Database Schema & Supabase RLS

Sumber: `master.md` §3. Schema final sudah diterapkan di project `axohgicormvtfilqcajn`.

File sumber: `supabase/schema.sql` (repo `univdin/qalbi-tahfidz`) → migration `20260807161005_initial_schema.sql`.

## Tabel (public)

| # | Tabel | Fungsi | Catatan |
| :--- | :--- | :--- | :--- |
| 1 | `profiles` | Profil user, FK ke `auth.users` | role: student/parent/teacher |
| 2 | `parent_child_links` | Relasi parent/teacher–child | UNIQUE(parent_id, child_id) |
| 3 | `hifz_cards` | Kartu SRS FSRS | id format `surah_X_start_Y_end_Z` |
| 4 | `review_logs` | Log review 1–4 | rating 1 Again, 2 Hard, 3 Good, 4 Easy |
| 5 | `user_streaks` | Streaks & gamifikasi | badges JSONB |
| 6 | `user_collections` | Notes & bookmarks | |
| 7 | `hafalan_mistake_logs` | Heatmap kesalahan | forget_word/tajweed/harkat/skip_verse |

## Index

- `idx_hifz_cards_user_due` — (user_id, due_date)
- `idx_review_logs_user_date` — (user_id, reviewed_at)

## RLS Policies (semua tabel ENABLE ROW LEVEL SECURITY)

Prinsip: **user hanya akses data miliknya** (`auth.uid() = …`), **guardian dapat membaca data child yang terhubung** via `parent_child_links`.

| Tabel | Policy |
| :--- | :--- |
| `profiles` | read/insert/update sendiri; read child terhubung |
| `parent_child_links` | manage: `auth.uid() = parent_id` |
| `hifz_cards` | view & manage sendiri; view child terhubung |
| `review_logs` | view sendiri; insert sendiri; view child terhubung |
| `user_streaks` | manage sendiri; view child terhubung |
| `user_collections` | manage sendiri |
| `hafalan_mistake_logs` | manage sendiri |

## Trigger

- `trg_profiles_updated` → `set_updated_at()` pada `profiles.updated_at`.

## Verifikasi (2026-08-07)

- `supabase db push` berhasil (NOTICE non-fatal).
- REST `/rest/v1/hifz_cards?select=id` → `[]` (tabel ada, RLS aktif, anon tidak bisa baca).
