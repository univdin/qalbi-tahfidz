# 07 — Execution Playbook Fase 1–7

Sumber: `master.md` §7. Detail: `../quran/master.md` baris 1224–1265.

## Status Progress (per 2026-08-07)

| Fase | Status | Keterangan |
| :--- | :--- | :--- |
| **Fase 1** — Environment, Supabase & Vercel Setup | ✅ | Repo GitHub, project Supabase `axohgicormvtfilqcajn`, Vercel + domain `quran.ilmify.id`, env vars |
| **Fase 2** — Edge Proxy & PWA Shell | ⏳ | Belum |
| **Fase 3** — Audio Engine, Prayer Hook & State | ⏳ | Belum |
| **Fase 4** — Quran Reader UI & Personalization | ⏳ | Belum |
| **Fase 5** — SRS Engine & Supabase Sync | ⏳ | Belum |
| **Fase 6** — Ecosystem, Shareable Cards & Dashboard | ⏳ | Belum |
| **Fase 7** — CI/CD & Deployment | 🔶 Sebagian | CI hijau, deploy otomatis; belum test E2E |

## Rincian Fase

### Fase 1 — Environment, Supabase & Vercel Setup ✅
- Setup env (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Apply schema + RLS (`supabase/schema.sql`).

### Fase 2 — Edge Proxy & PWA Shell
- `src/app/api/audio/proxy/route.ts` (5.2).
- `src/app/sw.ts` Serwist (5.3).

### Fase 3 — Audio Engine, Prayer Hook & State Engine
- `src/store/useAudioStore.ts` (5.4).
- `src/hooks/usePrayerTimes.ts` (5.5).
- `src/services/quranDataService.ts` (5.6) + `src/hooks/useAudioLoop.ts` (5.7).

### Fase 4 — Quran Reader UI & Personalization
- `WordMaskingContainer.tsx` (5.9), `RecitationRecorder.tsx` (5.10).
- Modul §6.1–6.3 (Reader, Masking dual-script, Offline prayer/qibla).

### Fase 5 — SRS Engine & Supabase Sync
- `useSupabaseSync.ts` (5.8), ts-fsrs, `srs_outbox` IndexedDB.
- Modul §6.4 (SRS deck & gamifikasi).

### Fase 6 — Ecosystem, Shareable Cards & Parent Dashboard
- `ShareableProgressCard.tsx` (5.11), `ProgressOverviewChart.tsx` (5.12).
- Modul §6.5.

### Fase 7 — CI/CD & Deployment
- CI GitHub Actions hijau.
- Deploy Vercel production + domain.
- E2E test & verifikasi Lighthouse/PWA.

## Referensi Infrastruktur

- Repo: https://github.com/univdin/qalbi-tahfidz
- Preview: https://qalbi-tahfidz.vercel.app
- Production: https://quran.ilmify.id
- Supabase: https://supabase.com/dashboard/project/axohgicormvtfilqcajn
