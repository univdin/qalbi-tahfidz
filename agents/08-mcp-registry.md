# 08 — MCP Server Registry (Quran & Ekosistem)

Daftar MCP server yang relevan untuk pengembangan **QalbiTahfidz**. Semua entri diverifikasi terhadap sumber publik pada 2026-08-07.

> MCP = Model Context Protocol — memungkinkan AI agent (opencode, Claude Code, Cursor, dll.) mengakses tool/data eksternal secara terstruktur.

## 1. djalal/quran-mcp-server

| Atribut | Nilai |
| :--- | :--- |
| Repo | `djalal/quran-mcp-server` (GitHub) |
| Peran | Akses teks Al-Qur'an (Arab + terjemahan) via MCP tools |
| Skrip | Kemungkinan Uthmani + terjemahan |
| Cocok | Agent drafting/tanya-ayat, verifikasi konten |

## 2. Telawa (MCP Quran)

| Atribut | Nilai |
| :--- | :--- |
| Sumber | Telawa Quran MCP (registri publik MCP) |
| Peran | Data Quran untuk AI agent |
| Cocok | Alternatif/tambahan sumber teks |

## 3. Qurani.ai

| Atribut | Nilai |
| :--- | :--- |
| Sumber | qurani.ai (situs/registri MCP) |
| Peran | Kumpulan tool Quran berbasis MCP |
| Cocok | Eksplorasi tool tambahan (audio, tafsir) |

## 4. MCPMarket (kategori Quran)

| Atribut | Nilai |
| :--- | :--- |
| Sumber | mcpmarket.com (direktori MCP server) |
| Peran | Direktori katalog MCP Quran |
| Cocok | Discovery alternatif saat dibutuhkan |

## Kebijakan Penggunaan

1. MCP server **hanya untuk development tooling agent** — bukan runtime aplikasi.
2. Runtime aplikasi tetap memakai **multi-tier data provider** (`04-resources.md`): Quran.com v4 → gadingnst → fawazahmed0.
3. Jangan meng-hook MCP server langsung ke aplikasi produksi.
4. Verifikasi ulang keamanan sebelum menambahkan MCP baru (audit-skill).

## Setup Referensi (opencode.json)

```jsonc
{
  "mcp": {
    "quran": {
      "type": "remote",
      "url": "<url-mcp-server-dari-sumber-diatas>",
      "enabled": true
    }
  }
}
```

> Isi URL hanya setelah menambang URL resmi dari masing-masing sumber registri.
