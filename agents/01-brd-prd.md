# 01 — BRD & PRD

Ringkasan dari `master.md` §1. Detail lengkap: `../quran/master.md` baris 19–73.

## Executive Summary

**QalbiTahfidz** adalah PWA dinamis skala produksi untuk mendigitalisasi hafalan Al-Qur'an anak dan keluarga melalui:

1. **Metode Ummi (Nada Nahawand)** — irama *Tinggi–Datar–Rendah* khas.
2. **Metode Tikrar** — Matrix Loops pengulangan berjenjang (Sabaq → Sabqi → Manzil).
3. **Spaced Repetition System (ts-fsrs)** — kalkulasi stability & difficulty dengan rating 1–4.
4. **Latihan visual interaktif** — Text Masking & Silence Insertion.
5. **Ekosistem harian offline** — Waktu sholat & arah kiblat (adhan-js).

## Target Audience

- **Primary:** Anak usia 5–15 tahun & santri pesantren/rumah tahfidz.
- **Secondary:** Orang tua & guru (monitoring multi-anak).

## Prinsip UX (Human-Centered Design)

- **Zero Dummy/Mock Data:** seluruh alur data wajib terhubung API eksternal nyata (Quran.com v4, gadingnst, fawazahmed0) + Supabase + IndexedDB.
- **Dual-Script:** dukungan penuh tulisan Arab **IndoPak** (Kemenag RI/Pesantren) dan **Uthmani** (Madinah).
- UI default **bahasa Indonesia**.

## Persona & Personalisasi Usia

| Kelompok Usia | Skema Tampilan | Qari | Target Harian |
| :--- | :--- | :--- | :--- |
| Early Child | Visual besar, animasi | Murottal anak Ummi | rendah |
| Junior | Standar + masking | Murottal Ummi/Nahawand | 10 ayat |
| Teen-Adult | Fitur penuh | Multi-qari | tinggi |

## Feature Priority Matrix

| Fitur | Prioritas |
| :--- | :--- |
| Core Mushaf (dual-script, tajweed, multi-qari, loop) | MVP (P0) |
| SRS Deck + Gamifikasi (streaks, badges) | P1 |
| Parent/Guardian Dashboard | P1 |
| Shareable Progress Card | P2 |

## User Roles

`student`, `parent`, `teacher` — lihat `03-db-schema-rls.md` dan tabel `profiles.role`.
