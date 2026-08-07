# 06 — Pola Implementasi Produksi (12 Patterns)

Sumber: `master.md` §5. Detail kode lengkap: `../quran/master.md` baris 346–1176.

| # | Pattern | File Target | Inti |
| :--- | :--- | :--- | :--- |
| 5.1 | Supabase Client | `src/core/supabase/client.ts` | Browser & SSR client, RLS-safe, anon key hanya |
| 5.2 | Edge Audio Streaming Proxy | `src/app/api/audio/proxy/route.ts` | Proxy archive/audio streaming, timeout AbortController |
| 5.3 | Serwist Service Worker | `src/app/sw.ts` | PWA offline-first, cache strategi |
| 5.4 | Audio/Personalisasi Store | `src/store/useAudioStore.ts` | Zustand: reciter, script, masking, per-usia |
| 5.5 | Prayer & Qibla Hook | `src/hooks/usePrayerTimes.ts` | adhan-js Kemenag method, offline |
| 5.6 | Multi-Tier Data Service | `src/services/quranDataService.ts` | **Fix Tier 3** — lihat `04-resources.md` |
| 5.7 | Precision Audio Looper | `src/hooks/useAudioLoop.ts` | Loop N×M per-ayat/blok, silence gap |
| 5.8 | FSRS Adapter & Sync | `src/hooks/useSupabaseSync.ts` | ts-fsrs → `hifz_cards`, outbox IndexedDB |
| 5.9 | Word Masking Presenter | `src/components/quran/WordMaskingContainer.tsx` | Uthmani/IndoPak, first-letter masking, tap-to-reveal |
| 5.10 | Recitation Recorder | `src/components/quran/RecitationRecorder.tsx` | Web Audio recording + perbandingan |
| 5.11 | Shareable Progress Card | `src/components/kids/ShareableProgressCard.tsx` | Canvas/SVG → gambar WhatsApp |
| 5.12 | Parent Analytics Chart | `src/components/dashboard/ProgressOverviewChart.tsx` | Recharts, data child terhubung |

## Aturan Kunci

- **Supabase**: `SUPABASE_SERVICE_ROLE_KEY` hanya di worker/admin, tidak pernah di client (`NEXT_PUBLIC_*` anon saja).
- **Multi-tier**: failover Quran.com → gadingnst → fawazahmed0 → IndexedDB.
- **Dual-script**: simpan `textArabicUthmani` & `textArabicIndopak` terpisah; render sesuai `preferred_script`.
- **Koordinat**: posisi canvas/elemen pakai ratio (xRatio/yRatio), bukan pixel absolut.
- **Timeout eksternal**: AbortController default 15s.
- **Zero mock data**: semua data dari API nyata.

## Checklist Per Component

- [ ] Zod schema dari `@docify/contracts` (jika dipakai di DOCIFY) / type lokal
- [ ] Tidak `any`
- [ ] Akses DB hormati RLS & `workspace_id`
- [ ] UI Tailwind + shadcn
