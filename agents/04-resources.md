# 04 — Multi-Tier Data Provider (Terverifikasi)

Sumber: `master.md` §4.2. Seluruh endpoint di bawah **telah diverifikasi langsung** pada 2026-08-07.

## Matriks Provider

| Provider | Tier | Fungsi | Status Verifikasi |
| :--- | :--- | :--- | :--- |
| **Quran.com API v4** (`@quranjs/api`) | 1 | Metadata, teks Uthmani, audio timing | Typed SDK |
| **Tarteel QUL** (`qul.tarteel.ai`) | 1 | Word-level alignment, font Indopak/Uthmani | — |
| **gadingnst/quran-api** | 2 | Teks Arab + terjemahan/tafsir Kemenag RI | ✅ `GET https://api.quran.gading.dev/surah/1` → 200 |
| **adhan-js** | Offline | Waktu sholat Kemenag RI, arah kiblat | 100% client-side |
| **fawazahmed0/quran-api** | 3 | Static JSON CDN jsDelivr | ✅ path diverifikasi (lihat bawah) |
| **Archive.org Murottal Ummi** | Media | Audio anak Juz 30 | via `/api/audio/proxy` |
| **ts-fsrs** | Engine | Algoritma SRS | — |

## Verifikasi gadingnst (Tier 2)

`GET https://api.quran.gading.dev/surah/1` → HTTP 200.

Struktur per ayat (`data.verses[0]`):

```jsonc
{
  "number": { "inQuran": 1, "inSurah": 1 },
  "meta": { "juz": 1, "page": 1, "manzil": 1, "ruku": 1, "hizbQuarter": 1, "sajda": {…} },
  "text": { "arab": "…", "transliteration": "…" },   // ⚠ TIDAK ada key "indopak"
  "translation": { "id": "Dengan nama Allah …" },
  "audio": {…}, "tafsir": {…}
}
```

**Catatan penting:** `text` hanya berisi `arab` & `transliteration` — **tidak ada `indopak`**. Kode produksi harus fallback `v.text.indopak || v.text.arab`, dan untuk skrip IndoPak sejati gunakan edisi fawazahmed0 `ara-quranindopak`.

## Verifikasi fawazahmed0 (Tier 3)

Base URL: `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1`

| Path | Status |
| :--- | :--- |
| `/editions/ind-indonesianislam/1.json` | ✅ 200 |
| `/editions/ind-indonesian/1.json` | ❌ **404 — path salah, JANGAN dipakai** |
| `/editions/ara-quranuthmanihaf/1.json` | ✅ 200 |
| `/editions/ara-quranindopak/1.json` | ✅ 200 |

Struktur semua edisi:

```jsonc
{ "chapter": [ { "chapter": 1, "verse": 1, "text": "…" }, … ] }
```

**Nomor ayat WAJIB dari `v.verse`, bukan index array** (`idx + 1` akan salah untuk surah yang tidak dimulai dari ayat 1, dan rawan saat index bergeser).

Pola Tier 3 yang benar (tiga edisi paralel + mapping per-verse):

```ts
const [idRes, uthmaniRes, indopakRes] = await Promise.all([
  fetch(`${FAWAZ}/editions/ind-indonesianislam/${n}.json`),
  fetch(`${FAWAZ}/editions/ara-quranuthmanihaf/${n}.json`),
  fetch(`${FAWAZ}/editions/ara-quranindopak/${n}.json`),
]);
```

## Panduan Integrasi

1. **Tier 1**: quranjs SDK → metadata + Uthmani tajweed + audio timing.
2. **Tier 2**: gadingnst → terjemahan/tafsir Kemenag RI; cache di IndexedDB (rate limit).
3. **Tier 3**: fawazahmed0 static → fallback offline PWA; ambil ID + Uthmani + IndoPak sekaligus.
4. Cache semua hasil di IndexedDB (`surahs` store) sebelum return.
