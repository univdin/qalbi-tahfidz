# Audit Resource Open Source & Integrasi

Diverifikasi langsung (2026-08-08) — lisensi, kredibilitas, dan status operasional setiap sumber yang dipakai.

## Dependensi npm

| Paket | Lisensi | Repo | Status |
|---|---|---|---|
| next / react / react-dom | MIT | vercel/next.js, facebook/react | aktif |
| @supabase/ssr + supabase-js | MIT | supabase | aktif |
| ts-fsrs | MIT | open-spaced-repetition/ts-fsrs (742★) | aktif, engine SRS |
| adhan | MIT | batoulapps/adhan-js (525★) | aktif |
| serwist (+cli,next) | MIT | serwist/serwist (1463★) | aktif, PWA/SW |
| zustand | MIT | pmndrs/zustand | aktif |
| @tanstack/react-query | MIT | TanStack/query | aktif |
| recharts | MIT | recharts/recharts | aktif |
| @quranjs/api | MIT | quran/api-js (52★) | **dormant** (butuh kredensial API Quran.com) |
| browser-whisper | MIT | tanpreetjolly/browser-whisper (193★) | aktif; **L2 offline verify** |
| @huggingface/transformers | Apache-2.0 | huggingface/transformers.js | aktif; dipakai via browser-whisper |
| tailwindcss, lucide-react, sonner, framer-motion, next-themes, idb, clsx, cva, tailwind-merge | MIT/ISC/Apache-2.0 | masing-masing mapan | aktif |

## Resource data Al-Qur'an (diverifikasi langsung)

| Sumber | Lisensi | Status | Pemakaian |
|---|---|---|---|
| gadingnst/quran-api (api.quran.gading.dev) | MIT (817★) | **200** | Teks Tier 2 (Uthmani, IndoPak, terjemahan) |
| fawazahmed0/quran-api (via jsdelivr) | Unlicense (public domain, 1149★) | **200** | Teks Tier 3 (fallback) |
| everyayah.com (audio qari) | tanpa lisensi eksplisit (rekaman qari) | **200** | Audio murottal per-ayat (reader) |
| archive.org `murottal-anak-juz-30-metode-ummi` | tanpa lisensi eksplisit | **37 MP3 Juz 30 (78–114), 200** | Modul Metode Ummi (kredit Muhdayin, 2020) |
| ~~cdn.islamic.network (audio per-ayat)~~ | — | **403 untuk surah ≥10** | **DIHAPUS** — format URL tak didukung |
| Quran.com audio API | — | per-surah (`download.quranicaudio.com`) | tidak cocok putar per-ayat |

## Integrasi AI

| Sumber | Lisensi | Status | Pemakaian |
|---|---|---|---|
| Cloudflare Workers AI `@cf/openai/whisper-large-v3-turbo` | OpenAI Whisper (Apache-2.0) | aktif | **L1** verifikasi bacaan (server) |
| browser-whisper (WebGPU whisper-base) | MIT | aktif | **L2** verifikasi offline (client) |
| tarteel-ai/whisper-base-ar-quran | — | **repo Not Found** | bukan dependensi aktif (kandidat fase lanjut saja) |

## Arsitektur verifikasi bacaan (3 lapis)

1. **L1 — Cloudflare Workers AI** (server, `POST /api/verify`): whisper-large-v3-turbo, batas kuota harian; skor via `wordOverlapScore` (F1 tanpa tashkeel) → verdict (lancar/cukup/perlu_ulang). Util bersama: `src/lib/recitationScore.ts`.
2. **L2 — client WebGPU** (`browser-whisper`, model `whisper-base` ~136MB di-cache OPFS): dipakai saat server gagal/offline dan `navigator.gpu` tersedia. Lazy-load. Catatan: jalur WASM membutuhkan cross-origin isolation (COOP/COEP); saat ini bergantung jalur WebGPU.
3. **L3 — self-check manual**: jika L1 dan L2 tidak tersedia.

## Catatan lisensi & atribusi

- Archive.org item Metode Ummi: lisensi eksplisit tidak dideklarasikan → atribusi publik "Muhdayin · archive.org" di halaman `/ummi`.
- Audio everyayah: rekaman qari yang dipakai luas di aplikasi Quran open source; tanpa lisensi eksplisit.
- Kepatuhan: semua dependensi npm berlisensi permisif (MIT/ISC/Apache-2.0); tidak ada komponen tertutup.
