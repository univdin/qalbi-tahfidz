---
name: quran-tahfidz
description: "Skill khusus proyek QalbiTahfidz (PWA hafalan Al-Qur'an anak & keluarga). Menyintesis spesifikasi master docs/quran/master.md, Metode Ummi/Nahawand, Tikrar, FSRS, dual-script Uthmani/IndoPak, multi-tier data failover (Quran.com → gadingnst → fawazahmed0), Supabase RLS, dan free-tier stack (Vercel + Supabase + GitHub) dalam satu alur kerja terpadu."
---

# QalbiTahfidz Skill (`quran-tahfidz`)

Skill khusus pengembangan **QalbiTahfidz** — PWA dinamis hafalan Al-Qur'an anak & keluarga di `quran.ilmify.id`. Repositori aplikasi: `univdin/qalbi-tahfidz` (folder: `/Users/mac/PROYEK/qalbi-tahfidz`).

Dokumentasi induk: `docs/quran/` (README + 01–09) dan `docs/quran/master.md` (single source of truth).

---

## 1. Arsitektur & Aturan Dasar

- **Stack:** Next.js 16 App Router + Tailwind v4 + Zustand + ts-fsrs + Serwist (PWA) + Supabase (Postgres RLS/Auth) + Vercel + Cloudflare CDN.
- **Client-Side Heavy:** rendering Quran, audio loop, masking, prayer-times = client-side. Server component hanya untuk data/metadata.
- **Multi-Tier Data (WAJIB failover):**
  1. **Tier 1** Quran.com v4 (`@quranjs/api`) — metadata, Uthmani tajweed, audio timing.
  2. **Tier 2** gadingnst `https://api.quran.gading.dev` — terjemahan & tafsir Kemenag RI.
  3. **Tier 3** fawazahmed0 static CDN `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1` — fallback offline.
  4. IndexedDB cache sebelum return.
- **Zero Dummy/Mock Data:** dilarang data tiruan; semua alur data wajib terintegrasi API nyata / Supabase / IndexedDB.
- **UI default bahasa Indonesia.**

## 2. Data Provider Terverifikasi (2026-08-07)

| Provider | Path yang BENAR | Path yang SALAH |
| :--- | :--- | :--- |
| gadingnst surah | `/surah/{n}` → 200 | — |
| fawazahmed0 ID | `/editions/ind-indonesianislam/{n}.json` → 200 | `ind-indonesian` → **404** |
| fawazahmed0 Uthmani | `/editions/ara-quranuthmanihaf/{n}.json` → 200 | — |
| fawazahmed0 IndoPak | `/editions/ara-quranindopak/{n}.json` → 200 | — |

**Struktur fawazahmed0:** `{ "chapter": [{ "chapter": n, "verse": v, "text": "…" }] }` — nomor ayat **harus dari `v.verse`**, bukan index array.

**Peringatan gadingnst:** `text` hanya `arab` & `transliteration` — **tidak ada `indopak`**. Fallback `v.text.indopak || v.text.arab`; untuk IndoPak sejati gunakan `ara-quranindopak`.

## 3. Database & Supabase RLS

- Project: `axohgicormvtfilqcajn` (URL `https://axohgicormvtfilqcajn.supabase.co`).
- 7 tabel: `profiles`, `parent_child_links`, `hifz_cards`, `review_logs`, `user_streaks`, `user_collections`, `hafalan_mistake_logs`.
- Semua tabel **ENABLE ROW LEVEL SECURITY**: user hanya akses datanya sendiri (`auth.uid() = id`); guardian membaca child via `parent_child_links`.
- **Env client:** hanya `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `service_role` TIDAK PERNAH di client.
- Schema: `supabase/schema.sql` (migration `20260807161005_initial_schema.sql`).

## 4. Metode Tahfidz

- **Ummi/Nahawand:** irama Tinggi–Datar–Rendah; **Silence Gap** `jeda = durasi_audio_ayat / delayRatio`.
- **Tikrar Matrix Loops N×M:** N loop per-ayat, M loop per-blok; Sabaq (baru) tinggi, Sabqi (minggu ini) sedang, Manzil (lama) rendah.
- **FSRS (ts-fsrs):** rating 1 Again / 2 Hard / 3 Good / 4 Easy; state 0 New, 1 Learning, 2 Review, 3 Relearning; kolom `stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, due_date`.

## 5. UI/UX & Anti-Slop

- Shadcn UI + Tailwind; font Arab Amiri/Scheherazade New/Noto Naskh Arabic (IndoPak vs Uthmani mapping di `fontFamily`).
- Personalisasi usia: `early_child` / `junior` / `teen_adult`.
- **Dual-script:** simpan `textArabicUthmani` & `textArabicIndopak` terpisah; render sesuai `preferred_script`.
- Koordinat canvas (jika ada) pakai **xRatio/yRatio**, bukan pixel absolut.

## 6. Perintah Standar

```bash
# di /Users/mac/PROYEK/qalbi-tahfidz
pnpm dev          # dev
pnpm typecheck    # tsc --noEmit — WAJIB lolos sebelum commit
pnpm lint         # eslint
pnpm build        # build
```

## 7. Checklist Sebelum Selesai

- [ ] `pnpm typecheck` & `pnpm lint` lolos.
- [ ] Tidak ada `any` / JSON untyped; tipe dari `@docify/contracts` bila dipakai DOCIFY.
- [ ] Tidak ada hardcode kredensial; env via `.env.local` / Vercel.
- [ ] RLS dihormati (workspace_id/user_id).
- [ ] Failover multi-tier terpasang untuk semua fetch Quran.
