# QalbiTahfidz — Dokumentasi Projek

Dokumentasi resmi **QalbiTahfidz**: PWA hafalan Al-Qur'an anak & keluarga (Metode Ummi/Nahawand, Tikrar, FSRS) di `quran.ilmify.id`.

- **Single Source of Truth:** `master.md` (spesifikasi induk lengkap)
- **Repositori aplikasi:** `univdin/qalbi-tahfidz` (GitHub, public)
- **Stack:** Next.js 16 + Supabase + Vercel + Cloudflare (Free Tier)

## Index Dokumen

| Dokumen | Isi |
| :--- | :--- |
| `01-brd-prd.md` | Business & Product Requirements (BRD/PRD), persona, fitur MVP, peran user |
| `02-architecture.md` | Arsitektur sistem & free-tier tech stack matrix |
| `03-db-schema-rls.md` | DDL PostgreSQL & Supabase RLS (`schema.sql`) |
| `04-resources.md` | Multi-tier data provider terverifikasi (Quran.com, gadingnst, fawazahmed0, dll.) |
| `05-metode-tahfidz.md` | Metode Ummi/Nahawand, Tikrar (Matrix Loops), FSRS |
| `06-patterns.md` | 12 pola kode produksi (Supabase, Edge Proxy, SW, store, hooks, komponen) |
| `07-playbook.md` | Execution Playbook Fase 1–7 |
| `08-mcp-registry.md` | MCP Server Registry (Quran & ekosistem) terverifikasi |
| `09-setup-notes.md` | Setup Supabase & Vercel (A2/A3) — referensi recovery |
| `10-research-tahfidz.md` | Riset metode tahfidz & ekosistem open-source + keputusan AI speech & koordinat mushaf |

## Status Infrastruktur (per 2026-08-07)

| Komponen | Status | Detail |
| :--- | :--- | :--- |
| GitHub repo | ✅ | `univdin/qalbi-tahfidz`, CI hijau |
| Supabase project | ✅ | `axohgicormvtfilqcajn` (Singapore), schema + RLS applied |
| Vercel deploy | ✅ | `https://qalbi-tahfidz.vercel.app` |
| Domain | ✅ | `https://quran.ilmify.id` (HTTP 200) |
| env vars | ✅ | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (production) |
| Supabase slot | ✅ | `univdin's Project` (Tokyo) di-pause untuk membuka slot free tier |
| Agent skill | ✅ | `.agents/skills/quran-tahfidz/SKILL.md` |
