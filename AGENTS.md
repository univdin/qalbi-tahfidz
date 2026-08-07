<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# QalbiTahfidz — Panduan Agent

PWA hafalan Al-Qur'an anak (5–15 th) & keluarga — Metode Ummi (Nada Nahawand), pengulangan berjenjang **Tikrar**, ulangan berjarak **FSRS** (ts-fsrs), mushaf **dwi-skrip Uthmani/IndoPak**, pemantauan progres orang tua/guru. Domain `quran.ilmify.id`.

## Dokumentasi — baca dulu sebelum coding

- **Single source of truth:** `agents/master.md` (spesifikasi induk).
- **Dokumen pendukung:** `agents/README.md` (index) + `agents/01`–`10` (BRD/PRD, arsitektur, DB+RLS, resources, metode, patterns, playbook, MCP, setup, **riset tahfidz**).
- **Skill proyek:** `.agents/skills/quran-tahfidz/SKILL.md`.

## Guardrails Non-Negotiable

1. **Zero mock/dummy data** — semua data nyata dari provider terverifikasi; pola multi-tier `04-resources.md` (Quran.com → gadingnst → fawazahmed0).
2. **Koordinat visual = rasio ternormalisasi 0–1** (`xRatio`, `yRatio`), TIDAK pernah pixel absolut — dataset koordinat legeRise (`10-research-tahfidz.md` §4) memakai rasio; gunakan rasio juga untuk UI canvas.
3. **Tipe aman** — definisikan skema Zod di `packages/contracts` (DOCIFY) dan impor type darinya; jangan `any` untuk data Quran/audio.
4. **Supabase RLS** — semua query menghormati `workspace_id`; `SERVICE_ROLE_KEY` hanya backend worker, tidak pernah di client.
5. **Path data yang benar** — `ind-indonesianislam` (BUKAN `ind-indonesian`); nomor ayat dari `v.verse` bukan index array; gadingnst tidak punya `text.indopak`.
6. **UI bahasa Indonesia**, shadcn/Tailwind, responsive mobile-first (PWA).

## Verifikasi sebelum selesai

```bash
pnpm lint
npx tsc --noEmit
pnpm build
```
