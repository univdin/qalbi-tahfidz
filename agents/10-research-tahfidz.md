# 10 — Riset Metode Tahfidz & Ekosistem Open-Source

> Status: **diverifikasi 2026-08-07**. Dokumen riset hasil kerja lapangan (web + GitHub API): metode tahfidz untuk fitur pedagogi, ekosistem open-source/API/data legal untuk integrasi, keputusan arsitektur AI speech, dan evaluasi teknis data koordinat mushaf.
> Tautan silang: `04-resources.md` (provider data), `05-metode-tahfidz.md` (engine metodologi), `master.md` §4 (spesifikasi induk).

---

## 1. Metode Tahfidz (untuk fitur pedagogi)

### 1.1 Metode Ummi — 7 Tahapan Pembelajaran
Sumber: [ummifoundation.org](https://ummifoundation.org) — "7 Tahapan Pembelajaran".

| Tahap | Nama | Esensi untuk alur sesi anak |
| :--- | :--- | :--- |
| 1 | **Pembukaan** | Salam, doa, pengkondisian fokus |
| 2 | **Apersepsi** | Mengulang hafalan sebelumnya (jembatan ke materi baru) |
| 3 | **Penanaman Konsep** | Perkenalan ayat baru (audio + visual + makna) |
| 4 | **Pemahaman Konsep** | Tanya-jawab makna/isi ayat |
| 5 | **Latihan/Keterampilan** | Pengulangan aktif (Tikrar) |
| 6 | **Evaluasi** | Penilaian kelancaran & tajwid |
| 7 | **Penutup** | Doa penutup, reward, motivasi |

**Implikasi QalbiTahfidz:** alur sesi harian mengikuti 7 tahap ini. Nada **Nahawand** (tinggi–datar–rendah) + rumus **silence gap** `jeda = durasi_audio_ayat / delayRatio` ada di `05-metode-tahfidz.md`. Formula numerik Ummi/Tikrar di `master.md` tersimpan sebagai gambar (image5–image23) — **tidak text-editable**; implementasi ulang mengikuti tabel kategori (Sabaq/Sabqi/Manzil).

### 1.2 Metode Tikrar
Pengulangan berjenjang **N×M** (N kali per-ayat → M kali per-blok/halaman) sebelum pindah materi. Kategori: Sabaq (baru) loop tinggi, Sabqi (pekan ini) sedang, Manzil (lama) rendah.

### 1.3 Metode Tilawati
Pengajaran **berirama/nada** (musikalisasi bacaan) untuk memudahkan anak menangkap pola bacaan. Riset pendukung (UNJ): [repository.unj.ac.id/40118](https://repository.unj.ac.id/40118/) — kajian efektivitas metode Tikrar & Tilawati terhadap kualitas hafalan.

### 1.4 FSRS (ts-fsrs)
Sudah dipakai sebagai engine SRS — stabilitas & kesulitan dari rating 1–4 (Again/Hard/Good/Easy). Detail di `05-metode-tahfidz.md`.

---

## 2. Ekosistem Open-Source Terverifikasi

### 2.1 Data teks & ayat
| Resource | Lisensi | Status | Catatan |
| :--- | :--- | :--- | :--- |
| **Quran.com API v4** (`@quranjs/api`) | (SDK) | ✅ Tier 1 | Metadata, Uthmani tajweed, audio timing |
| **gadingnst/quran-api** | MIT | ✅ Tier 2 | Terjemahan/tafsir Kemenag; `text` **tanpa** `indopak` |
| **fawazahmed0/quran-api** | — | ✅ Tier 3 | CDN jsDelivr; `ind-indonesianislam`, `ara-quranuthmanihaf`, `ara-quranindopak` semua 200 |
| **Tanzil text** | **CC BY 3.0** | ✅ | **Dilarang mengubah teks**; wajib atribusi + link tanzil.net + sertakan notice |
| **imranpollob/quran-indopak** | — | ✅ | Script IndoPak + font (untuk render sendiri) |

### 2.2 Koordinat / mushaf visual
| Resource | Lisensi | Status | Catatan |
| :--- | :--- | :--- | :--- |
| **legeRise/quran-indopak-ayah-coordinates** | MIT (JSON) | ✅ | 548 halaman scan + 6.236 bbox ayat, rasio 0–1 — evaluasi teknis §4 |
| legeRise/quran-hd-with-ayah-coordinates | **Tanpa lisensi** | ❌ | Rendered 3 MB, tapi all-rights-reserved — **jangan dipakai** |
| **bodoorzahera/Quran-coordinate** | MIT | ✅ | Word-coords 77.320 kata Madani (npm `quran-word-coords`) |
| quranpedia/quran-svg | — | ⚠️ | SVG + layer polygon ayat; cek lisensi sebelum pakai |

### 2.3 AI speech / koreksi bacaan
| Resource | Lisensi | Status | Catatan |
| :--- | :--- | :--- | :--- |
| **tarteel-ai/whisper-base-ar-quran** | Apache-2.0 | ✅ | Fine-tune `openai/whisper-base` utk Quran; metrik WER. Basis model fase-2 |
| **sayedmahmoud266/quran-ai-transcriping** | MIT | ⚠️ | FastAPI 0.104+; constraint propagation thd PyQuran 6.236 ayat; klaim akurasi 100%; **eksperimental & akan diarsipkan** — jadikan referensi, bukan dependensi |
| **yayaiu6/Real-Time-Quran-recitation-tracker** | MIT | ✅ | 106★; word-by-word realtime; fuzzy matching ala Tarteel — pola untuk integrasi client-side |
| **cpfair/quran-tajweed** | — | ⚠️ | JSON tajwid `{rule,start,end}`; index **Unicode codepoint** thd salinan `quran-uthmani.txt` (dari repo, ca Apr 2017) — data tajwid, bukan speech |

### 2.4 SRS & tracker hafalan
| Resource | Lisensi | Status | Catatan |
| :--- | :--- | :--- | :--- |
| **noureddin/zz** | Apache-2.0 | ✅ | SRS menghafal Quran — benchmark logika jadwal vs fsrs |
| **71iq/Hafiz** | MIT (code) | ✅ | Datasets lisensi terpisah |
| **yudapramana/quran-for-memorization** | MIT | ✅ | Visualisasi posisi ayat **tanpa teks** (inspirasi komunitas STUAH / Ust. Adi Hidayat); data sendiri hanya Juz 1 |
| wasi0013/Murajah | "Other" | ❌ | Lisensi tidak jelas — **jangan dijadikan basis** |

### 2.5 Kurasi ekosistem
- `tarekeldeeb/awesome-islamic-open-source-apps` — 170 proyek kategori Quranic Text & Reading.
- `Itqan-community/quran-apps-directory`, `MuslimTechNet/Islamic-Open-Source-Flutter-Apps`, `marzzuki/awesome-islamic-tech` (Unlicense).

### 2.6 Wajib dihindari
- **mubeenkhan246/hidaya-quran-learning-flutter-app** — lisensi *"Educational"* custom **non-komersial** + wajib ganti logo/nama/branding bila dipublikasikan ulang.

---

## 3. Keputusan Arsitektur AI Speech (tercatat 2026-08-07)

**Keputusan:** integrasi parsial client-side untuk MVP **+** rancang desain backend fase-2 (di luar scope MVP).

### 3.1 MVP — client-side (tanpa backend baru)
- Pola `yayaiu6`: rekam audio via `MediaRecorder` di browser → word-by-word tracking dengan fuzzy string matching terhadap teks ayat target.
- Trade-off jujur: akurasi lebih rendah dari model server; cukup untuk mode latihan ringan ("latihan mengikuti") tanpa false-positive yang parah.
- Simpan hasil di `hifz_cards` (status bacaan) via queue offline `srs_outbox`.

### 3.2 Fase-2 — backend FastAPI (desain, bukan implementasi)
```
POST /verify
  body: { audio_bytes, format, surah, ayah_start, ayah_end }
  res : { detected_verse, confidence, word_timings: [{word, start_ms, end_ms}] }
```
1. **Model:** `tarteel-ai/whisper-base-ar-quran` (Apache-2.0) — fine-tune `openai/whisper-base`.
2. **Alignment:** constraint propagation thd kanonik 6.236 ayat (PyQuran / data lokal) — pola `sayedmahmoud266`.
3. **Alur:** client rekam → kirim → transkripsi + alignment → hasil per-ayat → umpan balik + simpan ke Supabase.
4. **Hosting:** service Python terpisah di Railway (bukan di stack Next.js/Supabase sekarang).
5. **Catatan:** jangan depend ke `quran-ai-transcriping` (akan diarsipkan) — pinjam pola constraint propagation-nya.

---

## 4. Evaluasi Teknis: legeRise/quran-indopak-ayah-coordinates

### 4.1 Verdict
- **Format JSON** per halaman: `{pageNumber, image, ayahBoxes:[{refKey, surahNumber, ayahNumber, lineNumber, bbox:{x,y,width,height}}]}`.
- **Koordinat = rasio ternormalisasi 0–1** terhadap dimensi halaman → **memenuhi Rule 2** (tanpa pixel absolut).
- **Multi-line ayat** didukung: satu `refKey` bisa memiliki beberapa segmen (`lineNumber` berbeda); `segmentCount` tercatat di `ayah_ref_index.json`.
- **Kelengkapan:** 6.236 ayat, 548 halaman, index 1,2 MB (`ayah_ref_index.json` memetakan ayat → halaman+segmen).
- **Ukuran:** repo 271 MB → **±137 MB gambar webp** (197–280 KB/halaman) + 1.100 file JSON.
- **Lisensi:** JSON = MIT (M. Habib ur Rehman, 2026). **Gambar = scan Mushaf Taj Company, provenance tidak dijamin** oleh author.

### 4.2 Implikasi teknis
- 137 MB **tidak boleh** dibundle ke Vercel/`public/` (bundle & git membengkak; PWA anak jadi berat).
- JSON koordinat kecil (±1–3 KB/halaman + index) → **aman di-commit** sebagai data inti.
- Gambar: butuh strategi hosting terpisah (lihat §5).

---

## 5. Strategi Gambar Mushaf (keputusan: CDN + disclaimer)

- **Sajikan via CDN:** file webp dari repo public legeRise melalui `cdn.jsdelivr.net/gh/legeRise/quran-indopak-ayah-coordinates@main/all_paras/para_XX/page_NNN.webp` — lazy-load per halaman, cache di **Cache API** (PWA), tanpa menyentuh bundle aplikasi.
- **Disclaimer wajib:** atribusi + keterangan bahwa gambar adalah mushaf scan IndoPak/Taj Company untuk tujuan edukasi; dan JSON koordinat MIT oleh M. Habib ur Rehman. Taruh di halaman *Tentang* + footer.
- **Fallback/opsi masa depan:** render halaman sendiri dengan font `imranpollob/quran-indopak` + teks `fawazahmed0/ara-quranindopak` mengikuti rasio koordinat → bebas dari risiko hak cipta gambar scan.

---

## 6. Catatan Lisensi Penting

- **Tanzil text:** CC BY 3.0 — dilarang mengubah teks, wajib atribusi + link `tanzil.net` + sertakan notice pada distribusi.
- **MIT ≠ bebas atribusi**: sertakan LICENSE + notice asli pada komponen yang dipakai (mis. legeRise JSON, tarteel model).
- **Jangan** menyertakan kode berlisensi "Other"/non-komersial (Murajah, hidaya) ke repo.
- Setiap bundle teks/tafsir Kemenag RI dari gadingnst: konfirmasi ketentuan penggunaan Kemenag sebelum distribusi publik.

---

## 7. Keputusan Tercatat (2026-08-07)

| No | Keputusan |
| :-- | :-- |
| 1 | AI speech = integrasi parsial client-side (MVP) + desain backend FastAPI fase-2 |
| 2 | Data koordinat legeRise = **diintegrasikan** (JSON MIT); gambar scan via **CDN + disclaimer** |
| 3 | Dokumentasi riset = file baru ini di `agents/`; docs/quran dihapus dari repo DOCIFY (satu sumber kebenaran di qalbi) |
| 4 | Skill `quran-tahfidz` dipindah ke `.agents/skills/quran-tahfidz/SKILL.md` (qalbi) |
