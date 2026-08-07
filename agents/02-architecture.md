# 02 — Arsitektur & Tech Stack

Ringkasan dari `master.md` §2. Detail lengkap: `../quran/master.md` baris 75–118.

## Arsitektur Umum

**Client-Side React 18/19 + Next.js 16.3+ (App Router)** → deploy **Vercel Hobby**, **Supabase** (DB & Auth), **Cloudflare CDN/R2**, **GitHub Actions CI/CD**.

## Tech Stack Matrix

| Komponen | Teknologi | Catatan |
| :--- | :--- | :--- |
| Frontend | Next.js 16.3 (App Router) | Server component untuk data, client untuk canvas/editor |
| UI | Tailwind CSS v4, Shadcn UI, Framer Motion, Recharts | Fonts: Amiri, Scheherazade New, Noto Naskh Arabic |
| State | Zustand | audio store, personalisasi, skrip, masking |
| SRS | ts-fsrs | open-spaced-repetition |
| DB & Auth | Supabase (PostgreSQL, RLS) | multi-tenant, storage |
| Offline | Serwist (Service Worker), IndexedDB | outbox SRS sync |
| Waktu Sholat | adhan-js | 100% client-side |
| Data Quran | Quran.com v4 (@quranjs/api), gadingnst, fawazahmed0 | multi-tier failover |
| Audio | Edge Proxy `/api/audio/proxy`, Archive.org Ummi | |

## Alur Multi-Tier Data

```
Tier 1 Quran.com v4 / Tarteel QUL  (metadata, Uthmani, audio timing)
   ↓ unavailable
Tier 2 gadingnst/quran-api          (terjemahan & tafsir Kemenag RI)
   ↓ unavailable
Tier 3 fawazahmed0 static CDN       (offline PWA fallback)
   ↓ unavailable
IndexedDB cache
```

Lihat `04-resources.md` untuk detail tiap provider yang telah diverifikasi.
