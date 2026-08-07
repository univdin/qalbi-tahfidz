# 05 — Metode Tahfidz: Ummi/Nahawand, Tikrar, FSRS

Sumber: `master.md` §4.1. Detail lengkap: `master.md` baris 306–332.

## QalbiTahfidz Methodology Engine

```
┌───────────────┬─────────────────┬──────────────────┐
│ UMMI/NAHAWAND │ TIKRAR          │ FSRS ENGINE      │
├───────────────┼─────────────────┼──────────────────┤
│ Nada Tinggi-  │ Matrix Loops    │ Sabaq (baru)     │
│ Datar-Rendah  │ (N x M)         │ Sabqi (minggu ini)│
│ Tempo tartil  │ Loop per-ayat N │ Manzil (lama)    │
│ Jeda silence  │ Loop per-blok M │                  │
└───────────────┴─────────────────┴──────────────────┘
```

## 1. Metode Ummi (Nada Nahawand)

- Irama khas Metode Ummi: *Tinggi – Datar – Rendah*.
- **Rumus Jeda Hening (Silence Gap):** `jeda = durasi_audio_ayat / delayRatio`
  - `delayRatio` bervariasi per kategori (default untuk anak ~0.6–1.0).
  - Gap diukur terhadap durasi audio ayat (detik), bukan nilai absolut.
- Diterapkan pada "Dengarkan & Tirukan": audio diputar → silence gap → anak menirukan.

## 2. Metode Tikrar (Matrix Loops N × M)

Pengulangan berjenjang: **N kali per-ayat** dilanjutkan **M kali per-blok/halaman**.

| Kategori | Loop per-ayat | Loop per-blok | delayRatio |
| :--- | :--- | :--- | :--- |
| Sabaq (Baru) | tinggi | tinggi | paling rendah |
| Sabqi (Pekan Ini) | sedang | sedang | menengah |
| Manzil (Lama) | rendah | rendah | tertinggi |

> Nilai numerik formula disimpan sebagai gambar (image5–image23) di `master.md`; implementasi ulang mengikuti pola di atas saat pola kode §5.7 `useAudioLoop.ts` dibangun.

## 3. Algoritma Spaced Repetition (ts-fsrs)

- Mengkalkulasi **stability** & **difficulty** dari rating user 1–4:
  1. **Again**, 2. **Hard**, 3. **Good**, 4. **Easy**.
- State FSRS: 0 New, 1 Learning, 2 Review, 3 Relearning.
- Kolom terkait `hifz_cards`: `stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, due_date`.

## Integrasi Audio & SRS

- Loop audio dikendalikan `useAudioLoop` (Pattern audio precision).
- Review offline di-queue ke IndexedDB `srs_outbox`, disinkronkan ke Supabase via `useSupabaseSync`.
