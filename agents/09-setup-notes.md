# 09 — Setup Supabase & Vercel (A2/A3)

Catatan operasional lengkap hasil eksekusi Fase 1 (2026-08-07). Untuk referensi masa depan & recovery.

## Supabase

- **Org:** `QalbiTahfidz` (id `ggdllnatbjqncdmvmqmi`)
- **Project:** `qalbi-tahfidz` (ref `axohgicormvtfilqcajn`, region Southeast Asia/Singapore)
- **URL:** `https://axohgicormvtfilqcajn.supabase.co`
- **DB Password:** tersimpan di `/tmp/qalbi_dbpw.txt` (lokasi lokal sementara) — **pindahkan ke password manager**
- **API keys:** anon + service_role (saved `/tmp/qalbi_anon.txt`, `/tmp/qalbi_service_role.txt`)

### Catatan Slot Free Tier

- Supabase free tier max **2 project aktif per user**.
- Untuk membuat project ke-3, harus pause/delete project existing.
- **Action taken:** `univdin's Project` (ref `dlpzffnqjjuumnljedor`, Tokyo) di-**pause** (INACTIVE, data aman, bisa di-resume) untuk membuka slot.
- Pause via Management API (CLI tidak punya subcommand):
  ```bash
  curl -s -X POST "https://api.supabase.com/v1/projects/<ref>/pause" \
    -H "Authorization: Bearer sbp_..." -H "Content-Type: application/json"
  ```

### Apply Schema

```bash
export SUPABASE_DB_PASSWORD="$(cat /tmp/qalbi_dbpw.txt)"
supabase link --project-ref axohgicormvtfilqcajn
# migration: supabase/migrations/20260807161005_initial_schema.sql
supabase db push
```

## Vercel

- **Project:** `qalbi-tahfidz` (owner `univdin1`)
- **Preview:** `https://qalbi-tahfidz-<hash>-univdin1.vercel.app`
- **Production alias:** `https://qalbi-tahfidz.vercel.app`
- **Custom domain:** `quran.ilmify.id` → production (HTTP 200, DNS via `ns1/ns2.vercel-dns.com`)

### Env Production

| Vars | Nilai |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://axohgicormvtfilqcajn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |

Set via: `vercel env add <VAR> production`

### Domain

`vercel domains add quran.ilmify.id` → otomatis assign ke production deployment terbaru.
