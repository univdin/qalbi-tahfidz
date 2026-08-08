# Riset & Analisis — Repositori Eksternal untuk Pengembangan

Dianalisis 2026-08-08. Fokus: kredibilitas (lisensi, status), nilai bagi QalbiTahfidz, dan rekomendasi integrasi.

## Ringkasan

| Repo | Lisensi | Stars | Status | Nilai bagi QalbiTahfidz |
|---|---|---|---|---|
| TarteelAI/quranic-universal-library | MIT | 962 | aktif | Tinggi (dataset tafsir/morfologi/segmen audio/mushaf) |
| tarekeldeeb/quran-tajweed-embedded | CC BY 4.0 | 11 | **archived** (→ tajweed-embeddings) | Tinggi (highlight tajwid) |
| adelpro/quran-search-engine-mcp | MIT | 5 | aktif | Tinggi (search Quran + AEO/GEO), endpoint publik sehat |
| adelpro/quranpedia-mcp | MIT | 0 | baru | Rendah (tumpang tindih search-engine-mcp) |
| adelpro/open-mushaf-native | MIT | 36 | aktif | Referensi (mushaf offline/tafseer popup) |
| adelpro/open-quran | MIT | 8 | aktif | Referensi (audio streaming WebTorrent) |
| tarekeldeeb/awesome-islamic-open-source-apps | — | 108 | aktif | Indeks resource (referensi) |
| tarekeldeeb/QuranQuizNet | **NOASSERTION** | 1 | — | **Hindari** (lisensi tidak jelas) |
| Raza023/QuranReader | tidak jelas | 2 | — | **Hindari** (lisensi tidak jelas) |

## Analisis per repo

### 1. TarteelAI/quranic-universal-library (QUL) — MIT, 962★
CMS Rails untuk data Quran: terjemahan, tafsir, audio (per-ayat & gapless), segmen audio, skrip Arab, layout mushaf, mutashabihat, gramatika/morfologi, info surah.
- **Nilai**: sumber dataset untuk fitur lanjut (tafsir ringkas, morfologi per-kata, segmen audio per-ayat untuk Tikrar, mutashabihat).
- **Integrasi**: gunakan *data yang diekspor* (docs downloading-data), bukan menjalankan CMS-nya. Catatan: qul.tarteel.ai sebelumnya tidak responsif — repo aktif, tapi cek ketersediaan endpoint data saat implementasi.
- **Prioritas**: medium (butuh pipeline import data).

### 2. tarekeldeeb/quran-tajweed-embedded — CC BY 4.0, archived (→ tajweed-embeddings)
Anotasi tajwid Hafs: JSON `{surah, ayah, annotations:[{rule, start, end}]}` dengan indeks **Unicode codepoint** terhadap teks Tanzil Uthmani; plus file embedded dan decision trees.
- **Nilai**: highlight tajwid di reader (ghunnah, idgham, ikhfa, iqlab, madd, qalqalah, dll).
- **Integrasi**: butuh **alignment** indeks codepoint dengan teks Uthmani yang dipakai reader (gadingnst `text.arab`) — teks rujukan harus sama (Tanzil). Repo diarsipkan → gunakan penerus `tarekeldeeb/tajweed-embeddings`.
- **Prioritas**: high (fitur bernilai) — effort medium (normalisasi teks + rendering highlight).

### 3. adelpro/quran-search-engine-mcp — MIT, endpoint publik `https://mcp.quran.us.kg/`
MCP server (stdio + Streamable HTTP) dengan 8 tool: full-text search, metadata surah, navigasi ayat, lemma/root, morfologi. **Terverifikasi**: `/health` → `{"status":"ok","dataLoaded":true,"version":"0.5.0"}` HTTP 200, CORS-enabled, tanpa auth.
- **Nilai**: (a) fitur pencarian Quran yang akurat/hallucination-free; (b) **AEO/GEO** — bisa diserve ke AI (API / `llms.txt`); (c) tumpang tindih dengan quranpedia-mcp.
- **Integrasi**: proxy server-side `/api/quran/search` → panggil endpoint publik (aman, tanpa bocor key); atau jalankan engine lokal.
- **Prioritas**: high (low effort, value cepat).

### 4. adelpro/quranpedia-mcp — MIT, 0★
MCP server fakta Quran. Tumpang tindih dengan search-engine-mcp. Prioritas rendah — gunakan search-engine-mcp saja.

### 5. adelpro/open-mushaf-native — MIT, 36★ (Expo/React Native)
Mushaf offline (Android/iOS/web/macOS): swipe halaman, popup tafsir dinamis, cache gambar (expo-image), Jotai.
- **Nilai**: referensi UX mushaf berbasis halaman gambar + tafsir popup; sumber koordinat/layout halaman bisa menjadi referensi untuk rendering mushaf web.
- **Integrasi**: tidak langsung (RN/Expo ≠ Next.js web); pola caching gambar & tafsir popup dapat ditiru.

### 6. adelpro/open-quran — MIT, 8★ (Next.js + WebTorrent)
Audio Quran streaming terdesentralisasi via WebTorrent (PWA).
- **Nilai**: referensi distribusi audio terdesentralisasi / offline; kandidat bila ingin mengurangi beban server audio.
- **Prioritas**: low (WebTorrent menambah kompleksitas; setiapayah+CDN sudah cukup).

### 7. tarekeldeeb/awesome-islamic-open-source-apps — 108★
Daftar kurasi proyek Islam open source per tipe/bahasa. Nilai: indeks untuk penemuan resource di masa depan. Referensi saja.

### 8 & 9. QuranQuizNet & Raza023/QuranReader — lisensi tidak jelas/NOASSERTION
**Hindari** integrasi sampai lisensi terklarifikasi. Cukup jadi referensi fungsional (kuis; reader interaktif).

## Roadmap integrasi yang direkomendasikan

1. **Fase cepat (low effort, high value)**:
   - Pencarian Quran via `quran-search-engine-mcp` (endpoint publik, terverifikasi sehat) → route `/api/quran/search` + UI pencarian + AEO/GEO.
2. **Fase tajwid**:
   - `quran-tajweed-embedded` / `tajweed-embeddings` → normalisasi teks Tanzil → highlight tajwid di `SurahReader`.
3. **Fase dataset**:
   - Ekspor dataset QUL (tafsir ringkas, morfologi per-kata, segmen audio) → feed `quranDataService` (Tier 4 lokal).
4. **Referensi UX**:
   - Adopsi pola mushaf halaman + popup tafsir dari `open-mushaf-native` (bila fitur mushaf halaman dibangun).

## Catatan lisensi
- Semua yang direkomendasikan berlisensi permisif (MIT) atau CC BY 4.0 (tajwid — wajib atribusi).
- Hindari repo tanpa lisensi jelas (QuranQuizNet, Raza023/QuranReader).
