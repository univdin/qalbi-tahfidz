# QalbiTahfidz — Hafalan Al-Qur'an untuk Keluarga

> PWA dinamis skala produksi untuk hafalan Al-Qur'an anak (5–15 tahun) & keluarga, dengan Metode Ummi (Nada Nahawand), pengulangan berjenjang **Tikrar**, sistem ulangan berjarak **FSRS**, mushaf **dwi-skrip Uthmani/IndoPak**, dan pemantauan progres orang tua/guru.

**Domain:** `quran.ilmify.id` · **Stack:** Next.js 16 (App Router) · Supabase (PostgreSQL + RLS) · Vercel Hobby · GitHub Actions · Tailwind CSS v4

## Quick Start

```bash
pnpm install
pnpm dev
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Scripts

| Command | Keterangan |
| :-- | :-- |
| `pnpm dev` | Jalankan dev server |
| `pnpm lint` | ESLint |
| `pnpm build` | Production build |
| `npx tsc --noEmit` | Typecheck |

## Dokumentasi

Spesifikasi lengkap & playbook ada di repo ini: **`agents/`** (README index, `master.md` single source of truth, `01-brd-prd` … `10-research-tahfidz`). Untuk agent AI, baca `AGENTS.md` dan `.agents/skills/quran-tahfidz/SKILL.md`.

## Sumber Data Terverifikasi

- [Quran.com API v4](https://api.qurancdn.com) via [`@quranjs/api`](https://github.com/quran/api-js) — data utama
- [gadingnst/quran-api](https://github.com/gadingnst/quran-api) — terjemahan Kemenag RI
- [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) — fallback + skrip IndoPak + tafsir
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) — algoritma ulangan berjarak
- [adhan-js](https://github.com/batoulapps/adhan-js) — waktu sholat & kiblat offline

## Lisensi

MIT. Dibangun sebagai sedekah jariyah untuk umat.
