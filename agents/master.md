# **🤖 AGENTS.md — QALBITAHFIDZ PRODUCTION MASTER SPECIFICATION & IMPLEMENTATION GUIDE**

> **System Compatibility:** Document ini mengikuti standar terbuka [AGENTS.md](https://agents.md) yang dibaca native oleh AI agents (**opencode**, **Google Antigravity IDE / Cascade**, **Cursor**, **Claude Code**, **Codex**, **Windsurf**, **Jules**, dan **AI Coder LLMs**).

> **Primary Objective:** Panduan lengkap tunggal (*single source of truth*) skala produksi berarsitektur **Free Tier Stack (Vercel \+ Supabase \+ GitHub \+ Cloudflare)** yang menggabungkan BRD, PRD, BSD, ERD PostgreSQL RLS, Spesifikasi Teknikal, Metode Tahfidz (Ummi/Nahawand, Tikrar, FSRS), Ecosystem Integrations (adhan-js, @quranjs/api, Tarteel QUL), Dual-Script Rendering (Uthmani & IndoPak), Engine Personalisasi Usia, dan Production Execution Playbook untuk aplikasi web dinamis **QalbiTahfidz**.

## **0\. PRODUCTION DIRECTIVES & FREE TIER RESILIENCE MANDATE**

1. **Zero Dummy/Mock Data Policy:** Dilarang keras memproduksi data tiruan (*mock/stub/dummy*). Seluruh alur data wajib terintegrasi dengan REST/GraphQL API eksternal (*Quran.com v4*, @quranjs/api, *gadingnst*, *fawazahmed0*), library offline client-side (*adhan-js*), Supabase Realtime/PostgreSQL, dan IndexedDB lokal.  
2. **Free Tier Boundary Optimization:**  
   * **Vercel Hobby Tier:** Manfaatkan Edge Functions untuk Audio Proxy & Next.js Server Actions. Terapkan Caching Header agresif (Cache-Control: public, max-age=31536000, immutable) untuk meminimalisir penggunaan bandwidth Vercel.  
   * **Supabase Free Tier:** Gunakan PostgreSQL (500MB storage, Supavisor Connection Pooling) dan Row Level Security (RLS). Gunakan upsert dan kueri terindeks secara efisien.  
   * **Cloudflare Free Tier:** Manfaatkan Cloudflare Global CDN untuk Caching Asset/Audio dan Cloudflare R2 (10GB Free Tier, ![][image1] Egress Fee) jika menyimpan rekaman audio kustom.  
   * **GitHub Free Tier:** Manfaatkan GitHub Actions CI/CD untuk pengujian build otomatis (next build) dan pemeriksaan linting sebelum auto-deploy ke Vercel.  
3. **Strict Context Reading:** Baca dan pahami seluruh dokumen ini secara menyeluruh sebelum mengeksekusi pembuatan atau pengubahan kode.  
4. **Version Live Check Rule:** Selalu verifikasi versi terbaru pustaka via npm view \<package\> version sebelum instalasi.  
5. **Production Error Boundaries & Outbox Queue:** Setiap komponen async, audio fetcher, dan database write wajib memiliki penanganan kesalahan (*error boundary*, *retry mechanism*, *offline outbox queue* di IndexedDB saat koneksi terputus).

## **1\. BUSINESS REQUIREMENTS (BRD) & PRODUCT REQUIREMENTS (PRD)**

### **1.1 Executive Summary & Target Audience**

**QalbiTahfidz** adalah Progressive Web Application (PWA) dinamis skala produksi yang dirancang untuk mendigitalisasi dan mengoptimalkan hafalan Al-Qur'an anak-anak dan keluarga (Metode Ummi / Nada Nahawand) melalui integrasi pemutaran audio adaptif, *Spaced Repetition System* (SRS), latihan visual interaktif (*Text Masking & Silence Insertion*), dual-script Uthmani/IndoPak, serta fitur ekosistem harian (Waktu Sholat & Arah Kiblat offline).

* **Target Pengguna Primary (Anak Usia 5–15 Tahun & Santri Pesantren/Rumah Tahfidz):** Pembelajaran berbasis visual interaktif, animasi audio, audio loop berulang, dual script (IndoPak/Uthmani), dan sistem apresiasi lencana/piala.  
* **Target Pengguna Secondary (Orang Tua / Guru / Ustadz):** Pemantauan progres real-time (*Sabaq, Sabqi, Manzil*), analisis efikasi daya ingat, pengaturan target harian, dan menghubungkan akun anak (*parent-child/teacher-student linking*).

### **1.2 Tujuan Pengembangan & Prinsip UX (Human-Centered Design)**

1. **Aksesibilitas & Inklusivitas Khusus Pasar Indonesia:**  
   * Dukungan penuh tulisan Arab skrip **IndoPak** (standar Kementerian Agama RI / Pesantren) dan skrip **Uthmani** (standar Madinah).  
   * Terjemahan Bahasa Indonesia standar Kemenag RI dan Tafsir Ringkas/Jalalayn.  
   * Bebas gangguan (*distraction-free UX*): Tanpa iklan di tengah bacaan, skema warna spiritual tenang (*emerald/teal/amber*), serta mode Sepia/Dark/Light.  
2. **Habit Building & Learning Plans:**  
   * Program target harian (*Daily Goals*), pelacakan konsistensi (*Gentle Streaks*), dan *Learning Plans* (misal: "Program Juz Amma 30 Hari").  
3. **Ecosystem Non-Intrusive Pendukung:**  
   * Fitur Waktu Sholat (berbasis algoritma offline adhan-js metode Kemenag RI) dan Arah Kiblat interaktif yang tidak mengganggu halaman utama membaca.

### **1.3 Persona & Personalisasi Berdasarkan Kelompok Usia**

1. **Persona Anak Usia Dini (5–8 Tahun \- Early Visual Learners):**  
   * Interface berukuran tombol besar (![][image2]), audio-first, ikonografi ramah anak.  
   * Teks Indopak/Uthmani besar (![][image3]).  
   * Otomatisasi jeda "Tirukan" (![][image4] durasi ayat) dengan karakter maskot interaktif.  
2. **Persona Junior (9–12 Tahun \- Active Memorizers):**  
   * Mode *First-Letter Masking* dan *Tap-to-Reveal*.  
   * Rekorder audio mandiri (Track A vs Track B Qari Master) untuk self-evaluation.  
   * Gamifikasi berbasis Streak Harian & Lencana Juz 30\.  
3. **Persona Remaja & Dewasa (13+ Tahun & Orang Tua/Guru):**  
   * Akses penuh ke dashboard analitik SRS FSRS (stability, difficulty, due\_date).  
   * Mode membaca Uthmani/IndoPak tajweed lengkap dengan tafsir Kemenag RI & Asbabun Nuzul.  
   * Manajemen multi-anak/multi-santri bagi guru dan orang tua.

### **1.4 Feature Priority Matrix (MVP vs Advanced)**

| Kategori Modul | Fitur / Komponen Utama | Tingkat Prioritas | Teknologi / Data Source |
| :---- | :---- | :---- | :---- |
| **Core Mushaf** | Dual Script (Uthmani & IndoPak), Tajweed Warna, Multi-Qari, Speed/Loop | **MVP (P0)** | @quranjs/api, EveryAyah, QUL Fonts |
| **Tahfidz Engine** | Audio Silence Gap ("Dengarkan & Tirukan"), Masking Teks, SRS (ts-fsrs) | **MVP (P0)** | Web Audio API, ts-fsrs, IndexedDB |
| **Offline PWA** | Precache Teks & Audio, Service Worker Offline Fallback | **MVP (P0)** | Serwist (@serwist/next), idb |
| **Islamic Ecosystem** | Waktu Sholat (Kemenag RI), Arah Kiblat, Kalender Hijriah | **P1** | adhan-js (100% Client-Side Offline) |
| **Self-Review** | Web Audio Recitation Recorder (A/B Player) & Heatmap Error Log | **P1** | Web Audio MediaRecorder, IndexedDB |
| **Analytics & Linking** | Dashboard Ortu/Guru (Recharts), Parent-Child Linking (Supabase RLS) | **P1** | Supabase RLS, Recharts |
| **Gamification** | Canvas Shareable Progress Card Generator, Badges & Streaks | **P2** | HTML5 Canvas / SVG, Supabase |

### **1.5 User Roles & Authorization Matrix**

| Role | Akses Baca Publik | PWA Offline Cache | Perekaman Suara Local | SRS Deck Personal | Multi-Child Linking | Pengaturan Target Harian |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Anonymous User** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Registered Student** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (Personal) |
| **Parent / Guardian** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (Linked Children) |
| **Teacher / Ustadz** | ✅ | ✅ | ✅ | ✅ | ✅ (Multi-Santri) | ✅ (Class Target) |

## **2\. SYSTEM ARCHITECTURE & FREE TIER TECH STACK MATRIX**

Sistem menggunakan arsitektur **Client-Side React 18/19 dengan Next.js 16.3+ (App Router)** yang di-deploy ke **Vercel Hobby Tier**, **Supabase (Database & Auth)**, **Cloudflare CDN/R2**, dan **GitHub Actions CI/CD**.

┌──────────────────────────────────────────────────────────────────────────┐  
│              VERCEL HOBBY TIER \- NEXT.JS 16.3+ APP ROUTER                │  
│  ┌───────────────────────┐  ┌──────────────────────┐ ┌─────────────────┐ │  
│  │ Reader & Dual Script  │  │ Adaptive Audio Loop  │ │ Recharts Progress│ │  
│  │ (Uthmani / IndoPak)   │  │ (Silence Gap / Rec)  │ │ (SRS Analytics) │ │  
│  └───────────┬───────────┘  └──────────┬───────────┘ └────────┬────────┘ │  
└──────────────┼─────────────────────────┼──────────────────────┼──────────┘  
               │                         │                      │  
               ▼                         ▼                      ▼  
┌──────────────────────────────┐  ┌──────────────┐  ┌──────────────────────┐  
│ Zustand Store & Audio Engine │  │ ts-fsrs Engine│ │ TanStack Query v5    │  
└──────────────┬───────────────┘  └──────┬───────┘  └───────────┬──────────┘  
               │                         │                      │  
               ▼                         ▼                      ▼  
┌──────────────────────────────────────────────────────────────────────────┐  
│                   CLOUDFLARE & SUPABASE FREE INFRASTRUCTURE              │  
│  ┌─────────────────────────┐  ┌──────────────────┐ ┌──────────────────┐ │  
│  │ Serwist Service Worker  │  │ Supabase Auth &  │ │ Vercel Edge      │ │  
│  │ & IndexedDB \+ adhan-js  │  │ Postgres \+ RLS   │ │ Audio Proxy Route│ │  
│  └───────────┬─────────────┘  └────────┬─────────┘ └────────┬─────────┘ │  
└──────────────┼─────────────────────────┼────────────────────────┼──────────┘  
               │                         │                        │  
               ▼                         ▼                        ▼  
┌──────────────────────────────┐  ┌──────────────┐  ┌──────────────────────┐  
│ Tier 3: Static JSON CDN      │  │ Cloudflare R2│  │ Tier 1 & 2 External  │  
│ (fawazahmed0/quran-api)      │  │ Audio Cache  │  │ APIs & Archive.org   │  
└──────────────────────────────┘  └──────────────┘  └──────────────────────┘

### **Infrastructure & Tech Stack Matrix**

* **Deployment & Hosting:** Vercel Hobby Tier (Deploy Next.js 16.3+ App Router \+ Edge Proxy Routes).  
* **Database & Auth:** Supabase Free Tier (PostgreSQL \+ Row Level Security \+ Supabase Auth).  
* **CDN & Storage:** Cloudflare Free Tier (DNS, Caching, Cloudflare R2 for zero-egress audio storage).  
* **Source Control & CI/CD:** GitHub Free Tier (GitHub Actions automated testing & Vercel deployment).  
* **PWA & Service Worker:** Serwist (@serwist/next, @serwist/sw).  
* **State Management:** Zustand (state audio player, personalisasi UI, dan skrip) \+ TanStack Query v5 (async server state).  
* **SRS Engine:** ts-fsrs (open-spaced-repetition/ts-fsrs).  
* **Prayer & Ecosystem Engine:** adhan (adhan-js by Batoul Apps) untuk kalkulasi waktu sholat offline (Metode Kemenag RI) & Arah Kiblat.  
* **Offline Storage:** IndexedDB via idb library.  
* **UI & Visuals:** Tailwind CSS v4, Shadcn UI, Framer Motion, Recharts, Fonts Uthmani & IndoPak (Amiri, Scheherazade New, Noto Naskh Arabic).

## **3\. DATABASE SCHEMA (DDL) & SUPABASE ROW LEVEL SECURITY (RLS)**

### **3.1 PostgreSQL DDL Schema (schema.sql)**

\-- Enable UUID extension  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- 1\. Profiles Table (Linked to Supabase auth.users)  
CREATE TABLE public.profiles (  
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  
  full\_name TEXT NOT NULL,  
  role TEXT CHECK (role IN ('student', 'parent', 'teacher')) DEFAULT 'student',  
  target\_daily\_verses INT DEFAULT 10,  
  preferred\_qari TEXT DEFAULT 'murottal\_ummi\_nahawand',  
  preferred\_script TEXT CHECK (preferred\_script IN ('uthmani', 'indopak')) DEFAULT 'indopak',  
  preferred\_masking\_mode TEXT DEFAULT 'full',  
  age\_group TEXT CHECK (age\_group IN ('early\_child', 'junior', 'teen\_adult')) DEFAULT 'junior',  
  latitude FLOAT DEFAULT \-6.2088,  \-- Default Jakarta  
  longitude FLOAT DEFAULT 106.8456,  
  prayer\_calc\_method TEXT DEFAULT 'Kemenag',  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 2\. Parent/Teacher \- Child Links Table  
CREATE TABLE public.parent\_child\_links (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  parent\_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  
  child\_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  
  relationship\_type TEXT CHECK (relationship\_type IN ('parent', 'teacher')) DEFAULT 'parent',  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  UNIQUE(parent\_id, child\_id)  
);

\-- 3\. Hifz Cards Table (Spaced Repetition Cards \- FSRS Compatible)  
CREATE TABLE public.hifz\_cards (  
  id TEXT PRIMARY KEY, \-- Format: surah\_X\_start\_Y\_end\_Z  
  user\_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  
  surah\_number INT NOT NULL,  
  ayah\_start INT NOT NULL,  
  ayah\_end INT NOT NULL,  
  category TEXT CHECK (category IN ('sabaq', 'sabqi', 'manzil')) DEFAULT 'sabaq',  
  stability FLOAT NOT NULL DEFAULT 0.0,  
  difficulty FLOAT NOT NULL DEFAULT 0.0,  
  elapsed\_days INT NOT NULL DEFAULT 0,  
  scheduled\_days INT NOT NULL DEFAULT 0,  
  reps INT NOT NULL DEFAULT 0,  
  lapses INT NOT NULL DEFAULT 0,  
  state INT NOT NULL DEFAULT 0, \-- 0: New, 1: Learning, 2: Review, 3: Relearning  
  due\_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),  
  last\_reviewed\_at TIMESTAMPTZ DEFAULT NOW(),  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_hifz\_cards\_user\_due ON public.hifz\_cards(user\_id, due\_date);

\-- 4\. Review Logs Table  
CREATE TABLE public.review\_logs (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  card\_id TEXT NOT NULL REFERENCES public.hifz\_cards(id) ON DELETE CASCADE,  
  user\_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  
  rating INT CHECK (rating BETWEEN 1 AND 4\) NOT NULL, \-- 1: Again, 2: Hard, 3: Good, 4: Easy  
  listened\_repeats INT DEFAULT 1,  
  duration\_seconds INT DEFAULT 0,  
  reviewed\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_review\_logs\_user\_date ON public.review\_logs(user\_id, reviewed\_at);

\-- 5\. User Streaks & Gamification Table  
CREATE TABLE public.user\_streaks (  
  user\_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,  
  current\_streak INT DEFAULT 0,  
  longest\_streak INT DEFAULT 0,  
  last\_active\_date DATE DEFAULT CURRENT\_DATE,  
  total\_verses\_memorized INT DEFAULT 0,  
  badges\_earned JSONB DEFAULT '\[\]'::jsonb,  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 6\. User Notes & Bookmarks Collections Table  
CREATE TABLE public.user\_collections (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  
  surah\_number INT NOT NULL,  
  ayah\_number INT NOT NULL,  
  collection\_name TEXT DEFAULT 'Favorites',  
  personal\_notes TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 7\. Hafalan Mistake Logs Table (Heatmap Error Analysis)  
CREATE TABLE public.hafalan\_mistake\_logs (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  
  surah\_number INT NOT NULL,  
  ayah\_number INT NOT NULL,  
  word\_position INT,  
  mistake\_type TEXT CHECK (mistake\_type IN ('forget\_word', 'tajweed', 'harkat', 'skip\_verse')) DEFAULT 'forget\_word',  
  notes TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

### **3.2 Supabase Row Level Security (RLS) Policies**

\-- Enable RLS on all tables  
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.parent\_child\_links ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.hifz\_cards ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.review\_logs ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.user\_streaks ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.user\_collections ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.hafalan\_mistake\_logs ENABLE ROW LEVEL SECURITY;

\-- Profiles Policies  
CREATE POLICY "Users can read own profile"   
  ON public.profiles FOR SELECT USING (auth.uid() \= id);

CREATE POLICY "Parents and Teachers can read linked child profile"   
  ON public.profiles FOR SELECT USING (  
    EXISTS (  
      SELECT 1 FROM public.parent\_child\_links   
      WHERE parent\_id \= auth.uid() AND child\_id \= public.profiles.id  
    )  
  );

CREATE POLICY "Users can update own profile"   
  ON public.profiles FOR UPDATE USING (auth.uid() \= id);

CREATE POLICY "Users can insert own profile"   
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() \= id);

\-- Parent Child Links Policies  
CREATE POLICY "Parents and Teachers can manage links"   
  ON public.parent\_child\_links FOR ALL USING (auth.uid() \= parent\_id);

\-- Hifz Cards Policies  
CREATE POLICY "Users can view own hifz cards"   
  ON public.hifz\_cards FOR SELECT USING (auth.uid() \= user\_id);

CREATE POLICY "Guardians can view linked child hifz cards"   
  ON public.hifz\_cards FOR SELECT USING (  
    EXISTS (  
      SELECT 1 FROM public.parent\_child\_links   
      WHERE parent\_id \= auth.uid() AND child\_id \= public.hifz\_cards.user\_id  
    )  
  );

CREATE POLICY "Users can manage own hifz cards"   
  ON public.hifz\_cards FOR ALL USING (auth.uid() \= user\_id);

\-- Review Logs Policies  
CREATE POLICY "Users can view own review logs"   
  ON public.review\_logs FOR SELECT USING (auth.uid() \= user\_id);

CREATE POLICY "Guardians can view linked child review logs"   
  ON public.review\_logs FOR SELECT USING (  
    EXISTS (  
      SELECT 1 FROM public.parent\_child\_links   
      WHERE parent\_id \= auth.uid() AND child\_id \= public.review\_logs.user\_id  
    )  
  );

CREATE POLICY "Users can insert own review logs"   
  ON public.review\_logs FOR INSERT WITH CHECK (auth.uid() \= user\_id);

\-- User Streaks Policies  
CREATE POLICY "Users can manage own streaks"  
  ON public.user\_streaks FOR ALL USING (auth.uid() \= user\_id);

CREATE POLICY "Guardians can view linked child streaks"  
  ON public.user\_streaks FOR SELECT USING (  
    EXISTS (  
      SELECT 1 FROM public.parent\_child\_links   
      WHERE parent\_id \= auth.uid() AND child\_id \= public.user\_streaks.user\_id  
    )  
  );

\-- Collections & Notes Policies  
CREATE POLICY "Users can manage own collections"  
  ON public.user\_collections FOR ALL USING (auth.uid() \= user\_id);

\-- Mistake Logs Policies  
CREATE POLICY "Users can manage own mistake logs"  
  ON public.hafalan\_mistake\_logs FOR ALL USING (auth.uid() \= user\_id);

## **4\. METODE TAHFIDZ & MULTI-TIER DATA INTEGRATION**

### **4.1 Detail Spesifikasi Metode Tahfidz Integratif**

                               ┌──────────────────────────────────────────┐  
                               │       QALBITAHFIDZ METHODOLOGY ENGINE    │  
                               └────────────────────┬─────────────────────┘  
                                                    │  
                 ┌──────────────────────────────────┼──────────────────────────────────┐  
                 ▼                                  ▼                                  ▼  
      \[ METODE UMMI / NAHAWAND \]             \[ METODE TIKRAR \]                  \[ SPACING FSRS ENGINE \]  
   \- Nada Nahawand (Tinggi-Datar-Rendah)  \- Matrix Loops (N x M)            \- Sabaq (Hafalan Baru)  
   \- Tempo Konsisten (Tartil Sedang)      \- Audio Loop per-Ayah (N)         \- Sabqi (Hafalan Pekan Ini)  
   \- Jeda Silence Automatic (Tirukan)     \- Audio Loop per-Blok/Halaman (M) \- Manzil (Hafalan Keseluruhan)

1. **Metode Ummi (Nada Nahawand):**  
   * Menggunakan irama khas Metode Ummi (Lagu Nahawand: *Tinggi \- Datar \- Rendah*).  
   * **Rumus Jeda Hening (*Silence Gap*):![][image5]**  
     Di mana ![][image6] adalah durasi audio ayat (detik), ![][image7] bernilai ![][image8]–![][image9] (default ![][image10] untuk anak), dan ![][image11] bernilai ![][image12]–![][image13].  
2. **Metode Tikrar (Matriks Pengulangan Berjenjang):**  
   * Menggunakan matriks loop ![][image14]: ![][image15] kali pengulangan per-ayat dilanjutkan ![][image16] kali pengulangan per-blok/halaman.  
   * Tingkat kesulitan disesuaikan dengan kategori hafalan:  
     * **Sabaq (Baru):** ![][image17], ![][image18], delayRatio \= ![][image10].  
     * **Sabqi (Pekan Ini):** ![][image19], ![][image20], delayRatio \= ![][image8].  
     * **Manzil (Lama):** ![][image21], ![][image22], delayRatio \= ![][image23].  
3. **Algoritma Spaced Repetition System (ts-fsrs):**  
   * Mengkalkulasi kestabilan memori (stability) dan tingkat kesulitan (difficulty) berdasarkan 4 skala rating user: **1 (Again)**, **2 (Hard)**, **3 (Good)**, **4 (Easy)**.

### **4.2 Multi-Tier Open-Source Data Provider Matrix**

| Source / Repository | Tier | Role & Function in System | Integration Notes |
| :---- | :---- | :---- | :---- |
| **Quran.com API v4 & @quranjs/api** | Tier 1 | Metadata Surah, teks Uthmani Tajweed, audio timing. | Acuan skema data utama & Typed SDK. |
| **Tarteel QUL** (qul.tarteel.ai) | Tier 1 | Word-level audio alignment, Mushaf Indopak/Uthmani fonts. | Highlighting per kata & Indopak font assets. |
| **gadingnst/quran-api** | Tier 2 | Teks Al-Qur'an & Terjemahan Kemenag RI, Tafsir. | **Rate Limit:** 10 req/5 min. Wajib cache di IndexedDB. |
| **batoulapps/adhan-js** | Offline | Kalkulasi Waktu Sholat Kemenag RI & Arah Kiblat. | 100% Client-Side JS tanpa external network call. |
| **fawazahmed0/quran-api** | Tier 3 | Static JSON via CDN (jsDelivr/GitHub Pages). | Fallback offline PWA jika Tier 1 & 2 unreachable. |
| **Archive.org Murottal Ummi** | Media | Audio kustom Murottal Anak Metode Ummi (Juz 30). | Diarsipkan via Edge Proxy route /api/audio/proxy. |
| **open-spaced-repetition/ts-fsrs** | Engine | Algoritma Spaced Repetition. | Mengendalikan kalkulasi siklus review SRS. |

## **5\. CORE PRODUCTION CODE IMPLEMENTATION PATTERNS**

### **5.1 Supabase Client Configuration (src/core/supabase/client.ts)**

import { createClient } from '@supabase/supabase-js';

const supabaseUrl \= process.env.NEXT\_PUBLIC\_SUPABASE\_URL\!;  
const supabaseAnonKey \= process.env.NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY\!;

export const supabase \= createClient(supabaseUrl, supabaseAnonKey, {  
  auth: {  
    persistSession: true,  
    autoRefreshToken: true,  
    detectSessionInUrl: true,  
  },  
});

### **5.2 Edge Audio Streaming Proxy (src/app/api/audio/proxy/route.ts)**

import { NextRequest, NextResponse } from 'next/server';

export const runtime \= 'edge'; // Vercel Edge Runtime

export async function GET(request: NextRequest) {  
  const audioUrl \= request.nextUrl.searchParams.get('url');  
  if (\!audioUrl) return new NextResponse('Missing URL parameter', { status: 400 });

  const allowedHosts \= \['archive.org', 'download.archive.org', 'everyayah.com'\];  
  let parsed: URL;  
  try {  
    parsed \= new URL(audioUrl);  
  } catch {  
    return new NextResponse('Invalid URL parameter', { status: 400 });  
  }

  if (\!allowedHosts.some(host \=\> parsed.hostname.endsWith(host))) {  
    return new NextResponse('Host not authorized', { status: 403 });  
  }

  const fetchHeaders: HeadersInit \= {};  
  const rangeHeader \= request.headers.get('range');  
  if (rangeHeader) fetchHeaders\['Range'\] \= rangeHeader;

  try {  
    const response \= await fetch(audioUrl, { headers: fetchHeaders });  
    const proxyHeaders \= new Headers();  
    proxyHeaders.set('Content-Type', response.headers.get('content-type') || 'audio/mpeg');  
    proxyHeaders.set('Accept-Ranges', 'bytes');  
    proxyHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');  
      
    if (response.headers.has('content-range')) {  
      proxyHeaders.set('Content-Range', response.headers.get('content-range')\!);  
    }  
    if (response.headers.has('content-length')) {  
      proxyHeaders.set('Content-Length', response.headers.get('content-length')\!);  
    }

    return new NextResponse(response.body, { status: response.status, headers: proxyHeaders });  
  } catch {  
    return new NextResponse('Proxy execution failed', { status: 500 });  
  }  
}

### **5.3 Serwist Service Worker Integration (src/app/sw.ts)**

import { defaultCache } from '@serwist/next/worker';  
import { Serwist } from 'serwist';  
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

declare global {  
  interface WorkerGlobalScope extends SerwistGlobalConfig {  
    \_\_SW\_MANIFEST: (PrecacheEntry | string)\[\] | undefined;  
  }  
}  
declare const self: ServiceWorkerGlobalScope;

const serwist \= new Serwist({  
  precacheEntries: self.\_\_SW\_MANIFEST,  
  skipWaiting: true,  
  clientsClaim: true,  
  navigationPreload: true,  
  runtimeCaching: \[  
    {  
      matcher: ({ url }) \=\> url.pathname.startsWith('/api/audio/proxy'),  
      handler: 'CacheFirst' as const,  
    },  
    ...defaultCache,  
  \],  
  fallbacks: {  
    entries: \[{ url: '/\~offline', matcher: ({ request }) \=\> request.destination \=== 'document' }\],  
  },  
});

serwist.addEventListeners();

### **5.4 Audio, Personalisasi & Script Zustand Store (src/store/useAudioStore.ts)**

import { create } from 'zustand';

export type MaskingMode \= 'full' | 'first-letter' | 'hidden';  
export type AgePersona \= 'early\_child' | 'junior' | 'teen\_adult';  
export type QuranScript \= 'uthmani' | 'indopak';

interface AudioStoreState {  
  // Audio Parameters  
  isPlaying: boolean;  
  isSilenceGap: boolean;  
  repeatPerAyah: number;  
  delayRatio: number;  
  currentAyahRepeat: number;  
  currentAyahIndex: number;  
  playbackRate: number;  
  selectedReciter: string;  
    
  // Personalization & Script Parameters  
  agePersona: AgePersona;  
  maskingMode: MaskingMode;  
  preferredScript: QuranScript;  
  targetDailyVerses: number;  
    
  // Actions  
  setAudioState: (state: Partial\<AudioStoreState\>) \=\> void;  
  incrementAyahRepeat: () \=\> void;  
  resetAyahRepeat: () \=\> void;  
  nextAyah: () \=\> void;  
  setPersonalization: (persona: AgePersona, masking: MaskingMode, script: QuranScript, target: number) \=\> void;  
}

export const useAudioStore \= create\<AudioStoreState\>((set) \=\> ({  
  isPlaying: false,  
  isSilenceGap: false,  
  repeatPerAyah: 3,  
  delayRatio: 1.2,  
  currentAyahRepeat: 0,  
  currentAyahIndex: 0,  
  playbackRate: 1.0,  
  selectedReciter: 'murottal\_ummi\_nahawand',  
  agePersona: 'junior',  
  maskingMode: 'full',  
  preferredScript: 'indopak',  
  targetDailyVerses: 10,

  setAudioState: (newState) \=\> set((state) \=\> ({ ...state, ...newState })),  
  incrementAyahRepeat: () \=\> set((state) \=\> ({ currentAyahRepeat: state.currentAyahRepeat \+ 1 })),  
  resetAyahRepeat: () \=\> set({ currentAyahRepeat: 0 }),  
  nextAyah: () \=\> set((state) \=\> ({ currentAyahIndex: state.currentAyahIndex \+ 1, currentAyahRepeat: 0 })),  
  setPersonalization: (persona, masking, script, target) \=\>   
    set({ agePersona: persona, maskingMode: masking, preferredScript: script, targetDailyVerses: target }),  
}));

### **5.5 Offline Client-Side Prayer Times & Qibla Hook (src/hooks/usePrayerTimes.ts)**

'use client';

import { useState, useEffect } from 'react';  
import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from 'adhan';

export interface PrayerTimesData {  
  fajr: string;  
  dhuhr: string;  
  asr: string;  
  maghrib: string;  
  isha: string;  
  nextPrayerName: string;  
  nextPrayerTime: string;  
  qiblaDirection: number;  
}

export function usePrayerTimes(latitude \= \-6.2088, longitude \= 106.8456) {  
  const \[data, setData\] \= useState\<PrayerTimesData | null\>(null);

  useEffect(() \=\> {  
    const coords \= new Coordinates(latitude, longitude);  
    const date \= new Date();  
      
    // Method Kemenag RI (Fajr: \-20°, Isha: \-18°)  
    const params \= CalculationMethod.Singapore(); // Sesuai parameter standar Kemenag RI  
    const prayerTimes \= new PrayerTimes(coords, date, params);  
    const qiblaDir \= Qibla(coords);

    const formatTime \= (time: Date) \=\>   
      time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const next \= prayerTimes.nextPrayer();  
    const nextTime \= prayerTimes.timeForPrayer(next);

    setData({  
      fajr: formatTime(prayerTimes.fajr),  
      dhuhr: formatTime(prayerTimes.dhuhr),  
      asr: formatTime(prayerTimes.asr),  
      maghrib: formatTime(prayerTimes.maghrib),  
      isha: formatTime(prayerTimes.isha),  
      nextPrayerName: next ? next.toUpperCase() : 'FAJR',  
      nextPrayerTime: nextTime ? formatTime(nextTime) : formatTime(prayerTimes.fajr),  
      qiblaDirection: Math.round(qiblaDir),  
    });  
  }, \[latitude, longitude\]);

  return data;  
}

### **5.6 Dynamic Multi-Tier Data Service with Dual Script Support (src/services/quranDataService.ts)**

import { openDB } from 'idb';

export interface SurahVerse {  
  number: number;  
  textArabicUthmani: string;  
  textArabicIndopak: string;  
  translationId: string;  
}

export interface DynamicSurahData {  
  surahNumber: number;  
  name: string;  
  verses: SurahVerse\[\];  
  source: 'gadingnst' | 'fawazahmed0\_static' | 'indexeddb\_cache';  
}

const API\_ENDPOINTS \= {  
  GADING: 'https://api.quran.gading.dev',  
  FAWAZ\_STATIC: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1',  
};

async function getLocalDb() {  
  return openDB('QalbiTahfidzProductionDB', 1, {  
    upgrade(db) {  
      if (\!db.objectStoreNames.contains('surahs')) {  
        db.createObjectStore('surahs');  
      }  
      if (\!db.objectStoreNames.contains('audio\_recordings')) {  
        db.createObjectStore('audio\_recordings');  
      }  
      if (\!db.objectStoreNames.contains('srs\_outbox')) {  
        db.createObjectStore('srs\_outbox', { autoIncrement: true });  
      }  
    },  
  });  
}

export async function fetchDynamicSurah(surahNumber: number): Promise\<DynamicSurahData\> {  
  const db \= await getLocalDb();

  // 1\. Service Worker & Offline First Check  
  const cached \= await db.get('surahs', surahNumber);  
  if (cached && typeof navigator \!== 'undefined' && \!navigator.onLine) {  
    return { ...cached, source: 'indexeddb\_cache' };  
  }

  // 2\. Fetch Tier 2 Primary Indonesian Data (gadingnst API)  
  try {  
    const res \= await fetch(\`${API\_ENDPOINTS.GADING}/surah/${surahNumber}\`, {  
      next: { revalidate: 86400 },  
    });  
    if (res.ok) {  
      const json \= await res.json();  
      const payload: DynamicSurahData \= {  
        surahNumber,  
        name: json.data.name.transliteration.id,  
        verses: json.data.verses.map((v: any) \=\> ({  
          number: v.number.inSurah,  
          textArabicUthmani: v.text.arab,  
          textArabicIndopak: v.text.indopak || v.text.arab,  
          translationId: v.translation.id,  
        })),  
        source: 'gadingnst',  
      };  
      await db.put('surahs', payload, surahNumber);  
      return payload;  
    }  
  } catch {  
    console.warn('Tier 2 API unavailable, shifting to Tier 3 Static Fallback...');  
  }

  // 3\. Fallback Tier 3 Static CDN (fawazahmed0 API)  
  // Catatan: path edisi ID yang valid adalah ind-indonesianislam (bukan ind-indonesian).  
  // Struktur: { chapter: [{ chapter, verse, text }] }; nomor ayat wajib dari v.verse, bukan index.  
  try {  
    const [idRes, uthmaniRes, indopakRes] \= await Promise.all([  
      fetch(\`${API\_ENDPOINTS.FAWAZ\_STATIC}/editions/ind-indonesianislam/${surahNumber}.json\`),  
      fetch(\`${API\_ENDPOINTS.FAWAZ\_STATIC}/editions/ara-quranuthmanihaf/${surahNumber}.json\`),  
      fetch(\`${API\_ENDPOINTS.FAWAZ\_STATIC}/editions/ara-quranindopak/${surahNumber}.json\`),  
    ]);  
    if (idRes.ok \&\& uthmaniRes.ok \&\& indopakRes.ok) {  
      const idJson \= await idRes.json();  
      const uthmaniJson \= await uthmaniRes.json();  
      const indopakJson \= await indopakRes.json();  
      const versesById \= new Map<number, string>(  
        uthmaniJson.chapter.map((v: any) \=\> [v.verse, v.text] as const)  
      );  
      const versesByIdIndopak \= new Map<number, string>(  
        indopakJson.chapter.map((v: any) \=\> [v.verse, v.text] as const)  
      );  
      const payload: DynamicSurahData \= {  
        surahNumber,  
        name: \`Surah ${surahNumber}\`,  
        verses: idJson.chapter.map((v: any) \=\> ({  
          number: v.verse,  
          textArabicUthmani: versesById.get(v.verse) \|\| '',  
          textArabicIndopak: versesByIdIndopak.get(v.verse) \|\| '',  
          translationId: v.text,  
        })),  
        source: 'fawazahmed0\_static',  
      };  
      await db.put('surahs', payload, surahNumber);  
      return payload;  
    }  
  } catch {  
    console.error('Tier 3 API unreachable. Serving cached data.');  
  }

  if (cached) {  
    return { ...cached, source: 'indexeddb\_cache' };  
  }

  throw new Error(\`Critical Data Failure: Unable to fetch Surah ${surahNumber}.\`);  
}

### **5.7 Precision Audio Looper Hook (src/hooks/useAudioLoop.ts)**

'use client';

import { useEffect, useRef, useCallback } from 'react';  
import { useAudioStore } from '@/store/useAudioStore';

export interface AyahSegmentTimestamp {  
  ayahNumber: number;  
  startTime: number;  
  endTime: number;  
}

export function useAudioLoop(timestamps: AyahSegmentTimestamp\[\], audioProxyUrl: string) {  
  const audioRef \= useRef\<HTMLAudioElement | null\>(null);  
  const timeoutRef \= useRef\<NodeJS.Timeout | null\>(null);

  const {  
    repeatPerAyah,  
    delayRatio,  
    currentAyahRepeat,  
    currentAyahIndex,  
    isPlaying,  
    playbackRate,  
    setAudioState,  
    incrementAyahRepeat,  
    resetAyahRepeat,  
    nextAyah,  
  } \= useAudioStore();

  const handleSilenceGap \= useCallback((durationSeconds: number, onComplete: () \=\> void) \=\> {  
    setAudioState({ isSilenceGap: true });  
    if (timeoutRef.current) clearTimeout(timeoutRef.current);  
      
    const delayMs \= (durationSeconds \* delayRatio \* 1000\) / playbackRate;  
      
    timeoutRef.current \= setTimeout(() \=\> {  
      setAudioState({ isSilenceGap: false });  
      onComplete();  
    }, delayMs);  
  }, \[delayRatio, playbackRate, setAudioState\]);

  useEffect(() \=\> {  
    const audio \= new Audio(audioProxyUrl);  
    audioRef.current \= audio;  
    audio.playbackRate \= playbackRate;

    const handleTimeUpdate \= () \=\> {  
      if (\!audioRef.current || timestamps.length \=== 0\) return;  
        
      const currentSegment \= timestamps\[currentAyahIndex\];  
      if (\!currentSegment) return;

      if (audio.currentTime \>= currentSegment.endTime) {  
        audio.pause();  
        const segmentDuration \= currentSegment.endTime \- currentSegment.startTime;

        if (currentAyahRepeat \+ 1 \< repeatPerAyah) {  
          handleSilenceGap(segmentDuration, () \=\> {  
            incrementAyahRepeat();  
            if (audioRef.current) {  
              audioRef.current.currentTime \= currentSegment.startTime;  
              audioRef.current.play().catch(console.error);  
            }  
          });  
        } else {  
          handleSilenceGap(segmentDuration, () \=\> {  
            resetAyahRepeat();  
            if (currentAyahIndex \+ 1 \< timestamps.length) {  
              nextAyah();  
            } else {  
              setAudioState({ isPlaying: false });  
            }  
          });  
        }  
      }  
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);  
    return () \=\> {  
      audio.removeEventListener('timeupdate', handleTimeUpdate);  
      audio.pause();  
      if (timeoutRef.current) clearTimeout(timeoutRef.current);  
    };  
  }, \[  
    audioProxyUrl, timestamps, currentAyahIndex, currentAyahRepeat,  
    repeatPerAyah, playbackRate, handleSilenceGap, incrementAyahRepeat,  
    resetAyahRepeat, nextAyah, setAudioState  
  \]);

  return { isPlaying };  
}

### **5.8 Production FSRS Adapter & Supabase Sync Hook (src/hooks/useSupabaseSync.ts)**

'use client';

import { useEffect, useState, useCallback } from 'react';  
import { fsrs, generatorParameters, Rating, createEmptyCard, Card } from 'ts-fsrs';  
import { supabase } from '@/core/supabase/client';

const fSrsScheduler \= fsrs(generatorParameters({ request\_retention: 0.9, enable\_fuzz: true }));

export interface UserHifzCard {  
  id: string;  
  userId: string;  
  surahNumber: number;  
  ayahStart: number;  
  ayahEnd: number;  
  category: 'sabaq' | 'sabqi' | 'manzil';  
  stability: number;  
  difficulty: number;  
  elapsed\_days: number;  
  scheduled\_days: number;  
  reps: number;  
  lapses: number;  
  state: number;  
  dueDate: string;  
  lastReviewedAt: string;  
}

export function useSupabaseSync() {  
  const \[cards, setCards\] \= useState\<UserHifzCard\[\]\>(\[\]);  
  const \[loading, setLoading\] \= useState(true);

  const fetchCards \= useCallback(async () \=\> {  
    const { data: { user } } \= await supabase.auth.getUser();  
    if (\!user) {  
      setLoading(false);  
      return;  
    }

    const { data, error } \= await supabase  
      .from('hifz\_cards')  
      .select('\*')  
      .eq('user\_id', user.id);

    if (error) {  
      console.error('Supabase cards fetch error:', error);  
    } else if (data) {  
      setCards(data.map(d \=\> ({  
        id: d.id,  
        userId: d.user\_id,  
        surahNumber: d.surah\_number,  
        ayahStart: d.ayah\_start,  
        ayahEnd: d.ayah\_end,  
        category: d.category,  
        stability: d.stability,  
        difficulty: d.difficulty,  
        elapsed\_days: d.elapsed\_days,  
        scheduled\_days: d.scheduled\_days,  
        reps: d.reps,  
        lapses: d.lapses,  
        state: d.state,  
        dueDate: d.due\_date,  
        lastReviewedAt: d.last\_reviewed\_at  
      })));  
    }  
    setLoading(false);  
  }, \[\]);

  useEffect(() \=\> {  
    fetchCards();  
  }, \[fetchCards\]);

  const reviewCardAction \= useCallback(async (  
    existingDoc: UserHifzCard | null,  
    surahNumber: number,  
    ayahStart: number,  
    ayahEnd: number,  
    rating: Rating  
  ) \=\> {  
    const { data: { user } } \= await supabase.auth.getUser();  
    if (\!user) throw new Error('User authentication required');

    const cardId \= existingDoc ? existingDoc.id : \`surah\_${surahNumber}\_${ayahStart}\_${ayahEnd}\`;  
    const cardObj: Card \= existingDoc ? {  
      due: new Date(existingDoc.dueDate),  
      stability: existingDoc.stability,  
      difficulty: existingDoc.difficulty,  
      elapsed\_days: existingDoc.elapsed\_days,  
      scheduled\_days: existingDoc.scheduled\_days,  
      reps: existingDoc.reps,  
      lapses: existingDoc.lapses,  
      state: existingDoc.state,  
      last\_review: new Date(existingDoc.lastReviewedAt)  
    } : createEmptyCard();

    const schedulingCards \= fSrsScheduler.repeat(cardObj, new Date());  
    const resultCard \= schedulingCards\[rating\].card;

    const payload \= {  
      id: cardId,  
      user\_id: user.id,  
      surah\_number: surahNumber,  
      ayah\_start: ayahStart,  
      ayah\_end: ayahEnd,  
      category: existingDoc ? existingDoc.category : 'sabaq',  
      stability: resultCard.stability,  
      difficulty: resultCard.difficulty,  
      elapsed\_days: resultCard.elapsed\_days,  
      scheduled\_days: resultCard.scheduled\_days,  
      reps: resultCard.reps,  
      lapses: resultCard.lapses,  
      state: resultCard.state,  
      due\_date: resultCard.due.toISOString(),  
      last\_reviewed\_at: new Date().toISOString()  
    };

    const { error } \= await supabase.from('hifz\_cards').upsert(payload);  
    if (error) console.error('Supabase card upsert failed:', error);  
    else fetchCards();  
  }, \[fetchCards\]);

  return { cards, loading, reviewCardAction };  
}

### **5.9 Interactive Dual-Script Word Masking Presenter (src/components/quran/WordMaskingContainer.tsx)**

'use client';

import React, { useState } from 'react';  
import { MaskingMode, QuranScript } from '@/store/useAudioStore';

interface Props {  
  textUthmani: string;  
  textIndopak?: string;  
  script?: QuranScript;  
  mode: MaskingMode;  
  fontSize?: 'large' | 'medium' | 'small';  
}

export const WordMaskingContainer: React.FC\<Props\> \= ({   
  textUthmani,   
  textIndopak,   
  script \= 'indopak',   
  mode,   
  fontSize \= 'large'   
}) \=\> {  
  const activeText \= (script \=== 'indopak' && textIndopak) ? textIndopak : textUthmani;  
  const words \= activeText.split(' ');  
  const \[revealed, setRevealed\] \= useState\<Record\<number, boolean\>\>({});

  const toggle \= (idx: number) \=\> {  
    setRevealed(prev \=\> ({ ...prev, \[idx\]: \!prev\[idx\] }));  
  };

  const stripDiacritics \= (word: string) \=\>   
    word.replace(/\[\\u064B-\\u065F\\u0670\]/g, '').charAt(0);

  const fontClasses \=   
    fontSize \=== 'large' ? 'text-4xl leading-loose' :  
    fontSize \=== 'medium' ? 'text-3xl leading-relaxed' : 'text-2xl leading-normal';

  const fontFamily \= script \=== 'indopak' ? 'font-indopak' : 'font-arabic';

  return (  
    \<div dir="rtl" className={\`flex flex-wrap gap-3 ${fontFamily} ${fontClasses}\`} role="group" aria-label="Teks ayat dengan mode masking"\>  
      {words.map((word, idx) \=\> {  
        const isRevealed \= mode \=== 'full' || revealed\[idx\];  
        const display \= isRevealed ? word : mode \=== 'first-letter' ? stripDiacritics(word) : word;

        return (  
          \<button  
            key={idx}  
            type="button"  
            onClick={() \=\> toggle(idx)}  
            aria-pressed={isRevealed}  
            aria-label={isRevealed ? \`Kata ${idx \+ 1}, tampil\` : \`Kata ${idx \+ 1}, tersembunyi, ketuk untuk menampilkan\`}  
            className={  
              mode \=== 'hidden' && \!isRevealed  
                ? 'min-h-12 min-w-12 text-transparent bg-slate-200 dark:bg-slate-700 rounded-lg px-3 select-none transition-all'  
                : mode \=== 'first-letter' && \!isRevealed  
                ? 'min-h-12 min-w-12 text-amber-600 bg-amber-50 border-2 border-amber-300 rounded-lg px-3 font-bold shadow-sm'  
                : 'min-h-12 min-w-12 px-2 hover:text-emerald-600 transition-colors'  
            }  
          \>  
            {display}  
          \</button\>  
        );  
      })}  
    \</div\>  
  );  
};

### **5.10 Web Audio Recitation Recorder with Audio Comparison (src/components/quran/RecitationRecorder.tsx)**

'use client';

import React, { useState, useRef } from 'react';  
import { openDB } from 'idb';

interface RecitationRecorderProps {  
  surahNumber: number;  
  ayahNumber: number;  
  masterAudioUrl: string;  
}

export const RecitationRecorder: React.FC\<RecitationRecorderProps\> \= ({  
  surahNumber,  
  ayahNumber,  
  masterAudioUrl,  
}) \=\> {  
  const \[isRecording, setIsRecording\] \= useState(false);  
  const \[recordedBlobUrl, setRecordedBlobUrl\] \= useState\<string | null\>(null);  
  const \[activeTrack, setActiveTrack\] \= useState\<'A' | 'B'\>('A');  
  const mediaRecorderRef \= useRef\<MediaRecorder | null\>(null);  
  const chunksRef \= useRef\<Blob\[\]\>(\[\]);

  const startRecording \= async () \=\> {  
    try {  
      const stream \= await navigator.mediaDevices.getUserMedia({ audio: true });  
      const mediaRecorder \= new MediaRecorder(stream);  
      mediaRecorderRef.current \= mediaRecorder;  
      chunksRef.current \= \[\];

      mediaRecorder.ondataavailable \= (e) \=\> {  
        if (e.data.size \> 0\) chunksRef.current.push(e.data);  
      };

      mediaRecorder.onstop \= async () \=\> {  
        const audioBlob \= new Blob(chunksRef.current, { type: 'audio/webm' });  
        const blobUrl \= URL.createObjectURL(audioBlob);  
        setRecordedBlobUrl(blobUrl);

        // Save recording to IndexedDB  
        const db \= await openDB('QalbiTahfidzProductionDB', 1);  
        await db.put('audio\_recordings', audioBlob, \`rec\_${surahNumber}\_${ayahNumber}\`);  
      };

      mediaRecorder.start();  
      setIsRecording(true);  
    } catch (err) {  
      console.error('Microphone permission or recording error:', err);  
    }  
  };

  const stopRecording \= () \=\> {  
    if (mediaRecorderRef.current && isRecording) {  
      mediaRecorderRef.current.stop();  
      setIsRecording(false);  
    }  
  };

  return (  
    \<div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"\>  
      \<div className="flex items-center justify-between"\>  
        \<span className="text-sm font-semibold text-slate-700 dark:text-slate-200"\>  
          Latihan Suara (Self-Review A/B)  
        \</span\>  
        \<button  
          type="button"  
          onClick={isRecording ? stopRecording : startRecording}  
          className={\`px-4 py-2 rounded-full font-bold text-white text-sm transition-all shadow ${  
            isRecording ? 'bg-red-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'  
          }\`}  
        \>  
          {isRecording ? 'Stop Rekaman' : 'Mulai Rekam Suara'}  
        \</button\>  
      \</div\>

      {recordedBlobUrl && (  
        \<div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-700"\>  
          \<div className="flex items-center gap-2"\>  
            \<button  
              type="button"  
              onClick={() \=\> setActiveTrack('A')}  
              className={\`px-3 py-1 rounded-md text-xs font-bold transition-all ${  
                activeTrack \=== 'A' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700'  
              }\`}  
            \>  
              Track A: Suaraku  
            \</button\>  
            \<button  
              type="button"  
              onClick={() \=\> setActiveTrack('B')}  
              className={\`px-3 py-1 rounded-md text-xs font-bold transition-all ${  
                activeTrack \=== 'B' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700'  
              }\`}  
            \>  
              Track B: Qari Master (Ummi)  
            \</button\>  
          \</div\>

          \<audio  
            src={activeTrack \=== 'A' ? recordedBlobUrl : masterAudioUrl}  
            controls  
            className="w-full h-8"  
          /\>  
        \</div\>  
      )}  
    \</div\>  
  );  
};

### **5.11 Shareable Progress Canvas Card Generator (src/components/kids/ShareableProgressCard.tsx)**

'use client';

import React, { useRef } from 'react';

interface Props {  
  studentName: string;  
  badgeTitle: string;  
  surahCompleted: string;  
  streakDays: number;  
}

export const ShareableProgressCard: React.FC\<Props\> \= ({  
  studentName,  
  badgeTitle,  
  surahCompleted,  
  streakDays,  
}) \=\> {  
  const canvasRef \= useRef\<HTMLCanvasElement | null\>(null);

  const generateAndDownloadImage \= () \=\> {  
    const canvas \= canvasRef.current;  
    if (\!canvas) return;  
    const ctx \= canvas.getContext('2d');  
    if (\!ctx) return;

    // Background Gradient  
    const grad \= ctx.createLinearGradient(0, 0, 600, 400);  
    grad.addColorStop(0, '\#059669'); // Emerald  
    grad.addColorStop(1, '\#0284c7'); // Teal/Blue  
    ctx.fillStyle \= grad;  
    ctx.fillRect(0, 0, 600, 400);

    // Card White Frame  
    ctx.fillStyle \= '\#ffffff';  
    ctx.roundRect(30, 30, 540, 340, 20);  
    ctx.fill();

    // Text & Details  
    ctx.fillStyle \= '\#0f172a';  
    ctx.font \= 'bold 28px sans-serif';  
    ctx.fillText('QalbiTahfidz Achievement', 60, 80);

    ctx.fillStyle \= '\#059669';  
    ctx.font \= 'bold 36px sans-serif';  
    ctx.fillText(studentName, 60, 140);

    ctx.fillStyle \= '\#475569';  
    ctx.font \= '20px sans-serif';  
    ctx.fillText(\`Lencana: ${badgeTitle}\`, 60, 190);  
    ctx.fillText(\`Hafalan: ${surahCompleted}\`, 60, 230);  
    ctx.fillText(\`Streak Harian: 🔥 ${streakDays} Hari\`, 60, 270);

    // Download Image  
    const link \= document.createElement('a');  
    link.download \= \`pencapaian\_${studentName.toLowerCase().replace(/\\s+/g, '\_')}.png\`;  
    link.href \= canvas.toDataURL('image/png');  
    link.click();  
  };

  return (  
    \<div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"\>  
      \<canvas ref={canvasRef} width={600} height={400} className="hidden" /\>  
      \<div className="text-center"\>  
        \<h3 className="text-lg font-bold text-slate-800 dark:text-slate-100"\>Bagikan Pencapaian Hafalan\</h3\>  
        \<p className="text-xs text-slate-500"\>Buat kartu gambar pencapaian untuk dibagikan ke WhatsApp / Media Sosial\</p\>  
      \</div\>  
      \<button  
        type="button"  
        onClick={generateAndDownloadImage}  
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full shadow transition-all"  
      \>  
        Unduh Gambar Kartu Pencapaian  
      \</button\>  
    \</div\>  
  );  
};

### **5.12 Parent/Teacher Analytics Chart Component (src/components/dashboard/ProgressOverviewChart.tsx)**

'use client';

import React from 'react';  
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ChartDataPoint {  
  day: string;  
  sabaq: number;  
  sabqi: number;  
  manzil: number;  
}

interface Props {  
  data: ChartDataPoint\[\];  
}

export const ProgressOverviewChart: React.FC\<Props\> \= ({ data }) \=\> {  
  return (  
    \<div className="w-full h-80 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"\>  
      \<h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4"\>  
        Aktivitas Hafalan Harian (Sabaq, Sabqi, Manzil)  
      \</h3\>  
      \<ResponsiveContainer width="100%" height="85%"\>  
        \<BarChart data={data} margin={{ top: 10, right: 10, left: \-20, bottom: 0 }}\>  
          \<CartesianGrid strokeDasharray="3 3" vertical={false} /\>  
          \<XAxis dataKey="day" tick={{ fontSize: 12 }} /\>  
          \<YAxis tick={{ fontSize: 12 }} /\>  
          \<Tooltip /\>  
          \<Legend wrapperStyle={{ fontSize: 12 }} /\>  
          \<Bar dataKey="sabaq" name="Sabaq (Baru)" fill="\#ef4444" radius={\[4, 4, 0, 0\]} stackId="a" /\>  
          \<Bar dataKey="sabqi" name="Sabqi (Pekan Ini)" fill="\#f59e0b" radius={\[4, 4, 0, 0\]} stackId="a" /\>  
          \<Bar dataKey="manzil" name="Manzil (Lama)" fill="\#10b981" radius={\[4, 4, 0, 0\]} stackId="a" /\>  
        \</BarChart\>  
      \</ResponsiveContainer\>  
    \</div\>  
  );  
};

## **6\. PRD & SPECIFICATION MODULES UI/UX & PERSONALIZATION**

### **6.1 Modul Reader & Adaptive Audio Engine ("Dengarkan & Tirukan")**

* **Fitur Utama:** Pemutaran audio loop per-ayat/blok dengan jeda hening otomatis ![][image24] untuk latihan mandiri anak.  
* **Personalisasi Ummi (Nada Nahawand):**  
  * Irama teratur (Tinggi \- Datar \- Rendah).  
  * Pengatur rasio jeda delayRatio (![][image8]–![][image9]) khusus anak-anak.  
* **UI Indicator:**  
  * **Fase Dengarkan:** Animasi waveform hijau *emerald* \+ ikon speaker aktif.  
  * **Fase Tirukan:** Transisi otomatis; mikrofon/maskot bergerak dengan instruksi *"Sekarang giliranmu membaca..."*.

### **6.2 Modul Interactive Text Masking & Skrip Dual (Uthmani / IndoPak)**

* **Mode Teks:** Full Text, First-Letter Prompt (huruf depan kata berbingkai amber), dan Hidden Words (blok transparan yang dapat diklik).  
* **Adaptasi Skrip (IndoPak / Uthmani):**  
  * **IndoPak:** Font Naskh tebal standar Kemenag RI / Pesantren Indonesia.  
  * **Uthmani:** Font Tajweed Madinah standar internasional.  
* **Adaptasi Usia (Age Persona):**  
  * **Early Child (5–8 Tahun):** Font size ![][image3], tombol minimum ![][image25], visual audio heavy.  
  * **Junior (9–12 Tahun):** Mode *First-Letter Prompting* aktif secara acak untuk menguji memori.  
  * **Teen/Adult (13+ Tahun):** Teks tajweed lengkap \+ terjemahan Kemenag RI \+ tafsir ringkas & Asbabun Nuzul.

### **6.3 Modul Ecosystem Islamic Pendukung (Offline Prayer & Qibla)**

* **Komponen Waktu Sholat Ringkas (PrayerStatusHeader):**  
  * Countdown waktu sholat berikutnya di header tanpa mengambil ruang baca utama.  
  * Perhitungan 100% offline via adhan-js metode Kemenag RI.  
* **Modal Direction Qibla (QiblaCompassModal):**  
  * Tampilan kompas Arah Kiblat berbasis Device Orientation API.

### **6.4 Modul Spaced Repetition System (SRS) Deck & Gamifikasi**

* **Kategori Hafalan:** **Sabaq** (baru), **Sabqi** (pekan ini), dan **Manzil** (lama).  
* **Rating System:** 4 Tombol Rating: **1 (Again)**, **2 (Hard)**, **3 (Good)**, **4 (Easy)** dengan kalkulasi instan via ts-fsrs.  
* **Gamifikasi Streaks & Badges:**  
  * Poin konsistensi harian (*Streak Count*).  
  * Lencana Kelulusan Juz & Generator Gambar Kartu Pencapaian (ShareableProgressCard).

### **6.5 Modul Parent/Teacher Monitoring Dashboard**

* **Fitur:** Penghubungan akun anak via parent\_child\_links di Supabase.  
* **Analitik Dashboard:**  
  * **Progress Overview Chart (Recharts):** Stacked bar chart aktivitas harian/mingguan (Sabaq vs Sabqi vs Manzil).  
  * **SRS Memory Retention Gauge:** Indikator persentase keberhasilan review (![][image26] \= Hijau).

## **7\. EXECUTION PLAYBOOK FOR AI AGENTS**

### **Fase 1 — Environment, Supabase & Vercel Setup**

1. Inisialisasi Next.js 16.3+ App Router dengan TypeScript, Tailwind v4, dan Shadcn UI.  
2. Buat database Supabase (Free Tier) dan jalankan DDL Schema (schema.sql) serta RLS Policies (Bagian 3).  
3. Buat src/core/supabase/client.ts untuk koneksi Supabase JS Client.

### **Fase 2 — Edge Proxy & PWA Shell**

1. Buat API Route src/app/api/audio/proxy/route.ts dengan Vercel Edge Runtime (Bagian 5.2).  
2. Konfigurasi Serwist PWA (src/app/sw.ts, next.config.mjs, app/\~offline/page.tsx).  
3. Verifikasi build (next build) dan pastikan public/sw.js ter-generate tanpa error.

### **Fase 3 — Audio Engine, Prayer Hook & State Engine**

1. Buat useAudioStore.ts menggunakan Zustand dengan parameter personalisasi usia, skrip (IndoPak/Uthmani), & masking.  
2. Buat usePrayerTimes.ts (Bagian 5.5) menggunakan adhan-js.  
3. Implementasikan useAudioLoop.ts (Bagian 5.7) dengan dukungan precision loop dan silence gap.

### **Fase 4 — Quran Reader UI & Personalization Components**

1. Implementasikan WordMaskingContainer.tsx ber-standar A11y dan responsif skrip/usia.  
2. Buat komponen RecitationRecorder menggunakan Web Audio MediaRecorder API, IndexedDB, dan A/B Track switcher.

### **Fase 5 — Spaced Repetition (SRS) Engine & Supabase Sync**

1. Install ts-fsrs dan buat hook wrapper useSupabaseSync.ts (Bagian 5.8).  
2. Buat UI Flashcard Deck dengan 4 tombol rating (Again, Hard, Good, Easy) dan integrasi outbox queue.

### **Fase 6 — Ecosystem, Shareable Cards & Parent Dashboard**

1. Buat komponen Recharts ProgressOverviewChart (Bagian 5.12).  
2. Implementasikan komponen ShareableProgressCard (Bagian 5.11) untuk membagikan kartu pencapaian.  
3. Implementasikan alur penghubungan anak (*parent-child linking*) berbasis RLS Supabase.

### **Fase 7 — CI/CD Pipeline & Deployment**

1. Setup GitHub Repository dan buat file .github/workflows/ci.yml.  
2. Hubungkan GitHub repository ke Vercel Hobby Tier dan set Environment Variables (NEXT\_PUBLIC\_SUPABASE\_URL, NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY).

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAAwUlEQVR4XmNgGIJAUVFRHl0MBcjLy58A4qtAhW5A+jEQH0BXA1I0F4j/oon9B+JSZDGsgnJycjNA4nABGRkZaahCTyR1IM05KAoVFBQSQAKysrKmSOpA4hEgcaBBqjCBSpAA0BP6yAqBYsEoNgEZVTgUBoHEgQaFowgAHW+MrBDID0MxAMiwg1phiaYwFupGabCAiooKO9TEMGSFMCchi8HCcRKa2DZsCjF0QzUHIYvBJJYD8V8oDfJtAbqaUUA5AABF+EEsfly/zQAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAZCAYAAACM9limAAADIklEQVR4Xu1XTWxMURR+piHiP2FMMn/vzQ/D2KhZtCIRBJuGjVjYiFho4l/EqhYiwcKWSEiERKxsWIiFRLAgQpeabqgUUUSbCuKnGd+Zd+709HhvzEwnZlLvS77ce79z7plzz7v3vjeWFSBAgABTALZtj4LbtJ5KpXLQP4NF8BmkNu3TNCSTyU2c2F5tawQcx+nm+BMKk06nk9AemXEul5tLftDnS7+mAwVawws4q22TAeJ98CoMaXLM2n6wX+stgXg8vgTJfQeva1utQIwRbj0LA7ZLDQ/nELQBqbUcotHoIiQ5jKPwQNuqARa5E3N3Ub9CYYjnpJbNZudJP4lEIrEVPsfASxiGMplMAv2T4EVL3E/IfRbur7X4/U6wA/YNpKO/Dv12tCvRrjf+dQFBZiLIS/C5VcPlCP9R0acCTCgMEo+wbjhGu1X6aMDnKDjA/l/A3aTjIRxgbR+NkfMC9Htsd+cXMb7K8/vZbxg8JWPXBTyZxQg0ggTuaJsX4DuEZpoYUzJ/vJWgrWZbiVjATe2jwTu5iFxWSB3j+6Rb6uFx3Cfcv0e/Ke11gV+nP0zFqwH8u5DkQaXRwvVROg6+or4z/uYiXpZ+GnTU2C8l9Xw+P4P1a1JH7GWkI6cztazDE3Q+OdhpbfsbMO+bh0YJy8K0kSbGJUD76qVLRCKR2V6FIbD+SetYxxWOG9K2qoCK7uDgdX/TYO5Dxaccs4/G7HMeHNRzCbwAX1QoTKnYYK/STcF+gT+1rSLM5UW3vrZNFvhgW8qJlXcMHsARvwL46QZ+hbHdy5b0VUrvBZejG2L7DWn3BZI8oYM1EubDEe0eqZOGI7tZabfhd0FqGqIw5SMr7pc+oxUKhekYPybdaFjrYc5lo9GaAtt9Lb4BB8HXNDY2x/0MGOMFveC2R873gikMFpdGO8TziOXjD9t2jN/Z7m++j8VicdJt93/ZW9Y/jkedAgiHw3O4EPqOaSzwURXDj3RVQzzlTj3/XwNPfyEVhnaMtjUU9MGEBXdUQ9u9xJoG5NAN3uIdc5fG2ue/BL016TKnnUstuEX7BAgQIECr4zflDwu8QFcwWAAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAZCAYAAACM9limAAADP0lEQVR4Xu1XSWhUQRAdEzdUVNBxZLb+s4g6XtQ5JBKRaBQPojcPehESQaIIgoiIFxFUMDc9uB5UxIOECDkpKC4n8RAQRBERc3CLiAZXEqPxlb96UlPMwJ+fkBn1Pyi661V1dXX9XmZCoQABAgT4S+E4zlVjzDBkIJlM7td2C/g58HlLvuh2a3vVgKTX8QJ2aptfULxsNjtT6pBB6UPA3KfB/7A6+l3gbkifqgMJNfECOrStEqRSqVUc55bl0P9IHGwLLYf5WoizOvvRuH7J1Qzi8fgCJDcAuaJtHjGRF3jcEuh/I67ELnpmdQKO0nyp1ySi0ehc+tJI9p62VQouQmF3UIGYO0k65lifz+cnjYwojUQisQlj9kHOQa3LZDIJ9A9DzkKvt37IfRrtXMRthDTAvoZ49JvRX4Z2KdrV1t8XEGQqgryAPA6JyT2Cds8jyC/0J1gSMdupMGgPoO2MRCLT0d4xJe4hCdj3QnppLOQrpJV4HMvdzO0iHXFno3/QuDuf5rnI45+yHx3tIzK2L+DLzEOgfiRwXdvKAf5b4X8KbZ+jXhvoZzjBUnfMQ8lp8E4eRuwlkod+l+MVfTziMN8D7t+GrJB2X6DLEoEGbcX9wvBzHOJdg34HF6HoHoP+k/3KQhzDlORzudxk5i9LHrkvIh6FOzbadRReFgQ7qm1+YNwjQEm/IR0JbmO9Tfl9Il5yGnzsaGxRYQjMf9A81nGB49Zpmycg4S0c3PdvGoy9BBmSHBJbyXH/LDqdTs+iPuZrl37GvTf8Fqae+R7F24INGfGbyRPs5UW3vrZVCk6CFt0suO3Mv1J+560uOF+FMe5lS/xyxfdAFqNbx/ZOaS8LLOCQDjYaINY1Rz3x4L5QUrgfpgiulTjlR8e3RXIaojDfLSfulyeWo+cf+n05B/Law3Ostdy4ApN3caK9dhGyKMLvBNufc8KbtY+GLQx802j7eDxJ4fhTHONe+C8h72KxWJx49D9DXjP/fiTqP4BwODyDC6HvmLEF/gLEMMkGL4Kt2KjHjzfw9edQYWjHaNuYgn4wYcENXsS4l1jVgBx2QLp5x9wkXfv8l6BXEzuliXYutZCN2idAgAABah2/AebiGhQ8X6YVAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAZCAYAAABHLbxYAAABpklEQVR4Xu2Uu0oDQRiFE1F7RVCyl1zWQoNdQMQX8AksbSwUFUUhFnaCra0PYKVgY+Fr+AK2XkAimgRRjEI8P8zK72HHjUsshPngsMz5/505M3vJ5RyOf0axWKyXSqU19m2gvwkdRFEUYDiIe+cwvuS+voCJT6AO1DVa5x4b6p4vIewO9/WdLEERbA86hla5/mdkCPrBnoWBMAxH2NSgvsKelQxB39mzgd7ncrk8zr6A2q3v+5PsW8kQ9A06glo4kVNz/zz3xaD2gkAeeXd4baa0l4pZaIN9G+htY5GFeIwTm5U5EGZU92l0WAkJTXNPKrIITmaT/d9gNttmXyNhJWQQBDNc6wkTdIt9G7VabYg9E7TLvgb1R6hZqVRCrvWELIBHuc1+EtjQkgm1q/20oBIyficlrOd5PvekYoIm/rARbFF/tehdlv6Ej0PmuNJejA6pvCbP8SOFQmHMnMYh10A+6aQSxhfsxcB/wDsZsS+g9oQNTLD/DTSdQQ3oBro213uoo/twoufw6tpTm2uZ6yvsvO4RqtXqcNojRtB99hwOh8PRHz4BXcmCL60/hQkAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAaCAYAAADxNd/XAAACMklEQVR4Xu2WT0jUQRTHpUMH87pubLs7u+5tkfDaJTSoPHYICrp6Er0KIVFepU6SfzL8A3n1JJ1ConsQRYqoePJQiCAkJv7ZPq+dp4/BdYV19Sf8vvBl3rzvm5n3ZmZnfw0NMWLEOIJzbhBuwZLnDtwMfIvhuMhBkw39Avy7lbTIQBLM5XJfQr8gkUg0ef1VqEUCJPbUn0BHqClOO6FLB4ktVEsu6gVUTe4sMZcGn9zn0K/I5/MPfEz0XiO9/7TtoaZAX5aYQqHQHGq1gnWfMPd+Npt9GWpnAoOXql0Nv/sHof+8wNwTtRQgyVUswB3/wK+F2nmB+cdrKqDS+49/QPRMJtNq/fh64Bv4Hq4Y///N0A0x/WfpdPoW7U/mfE67UywWr+s4kh+RAtC+o/3AnlLtVBDcLwsw4L71M9EjV/6U2LN+Bf55Yh56e1YKNdoa7BZbCk+lUo1iE9OJ/5PYPAq3sXd1jBRA/1D7kpPaJ4KAYXgggYb7Mqkrfwt9sDt0EkjiLnEf4TacUD+J3tQEaH8fjzjSZuC6xgj8CYxq32p1gRTLgn3efo09GeilZDJ5g7bL+Obggtj6aWK0d3DI9OtegF38Gzs7TbttfC+cuRLeV+LUnNgU/Fj6jBvzmrxCIzZW7bqAxXpd+Qpu+J0+JJk2GyOF2b6/PnJFv8J78BcckiJc+fNd+Bb+kXnhlh1/IeCPLiMtP96CXJNQjzzYtb+cTgvtaqhdGZD8ndAXI0bE8A9+98NDs84RQwAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAAZCAYAAAAhd0APAAAEgElEQVR4Xu1YW4iVVRRWR8vsRelhdC5nzw3EIQQbgmIeQgsNI6mopOwCEUgZUlMEERUYCEUPpaBvZYGRRBcKIoqigpB6SGQIouihGs3AKC0TaZzT953zrZl11tlnbs6Rov+Dxb/3t657r/+yz5k3r0CBAgX+/ejt7e3s6upaGvkp0NLd3b0ykgVmiJTSG5AyBRu6PuobAfa/m1/UzRUQ+7jlkDDnaZuXSqX3o89cAfHXMUd7e/slUdc0MOFMmkBgE+5qZhMMtukZvtKQgYGBRVE3XcD/vcgR4A8r7xNR1zTMsgm35jZnrqHNGM3w10k3HHXTxWT1d3Z2Xhq5pmI2TYDPTZMtYq6gjf47w18p3WxrWHAOvucOJN8CeRXd3qR5tgn4WN8N3THc9fswXux14G/MLQK2j4I/CDmE8R1BvQA5L0eu1dCvgayVzzLIIHJcYZxBG51rwuPS7cno1iHea7iOIObLUY/8rdCNyn8jxdaP8QrINvi9ANkcfVXjMK4fQDZE/ZSA8yolvp9znoo0r2sCuLNYyF6OVXS5o6Ojz+nrmoD5mOcwPgk540xaMH/ackJ2kETcduYjZzkNsqtpAuaPiH/X84RunLK9TlL1huNHtsNsMB9icxRjSPKAdKtQw9vU4fqk+Uh3zOfE+CPIEW8zJZT04xzvm5D0YQo2NVzKN+HnFN7fMTaBDXg++nLhaMZFniNU8xh8vsT1q1RtLDe5N9oSqfqEldva2pY4jjFq6kK+W2INHtT5JiD/gZy97HZGPgsYXq9iVkQd+dAE2n3HJ8AE/k/5IlKmCREofDltcH0w6pRj/FXSKJbs4pPwrOJe5fkGWEj/GH+mTVAdh7yN+MprLfJZwHB/I2MtaPz9poTDKOKaKM4m2wRwX8v/RWs8Yj+UsfvV/GE3iPG90YZQrNw3gXxdfiLpdYW830K2pvCaJGbZhM+9jfjKb6bIZwHDXTTu6ekpZXQs+Fo/h4x4m4iUaYL8jme4Ic+Jr3yfsNB+XE9HvUH+uSMq+brF67VV7u/vv8A4+kdb5L3Zcxgf9HrVFpvwg7dxfF0djcCPIh3uiQrxG938j1xgLPAzN97sbVDwnSq8xzhCsR8Gv8/zTscn4nDUGWRTV8tkPHL9GDmzxfUVXlH/Dd4f499srHlswqlG+SAnIt8QSPxODIT5n0r4kqMrDQP3qRE6wXxoc8S6T7FaOE/Vox2fqMfMBvNvVORuyCfGO/0e5VkWdQRiLZZ/bvFnpKs8Zbbx4sbMDt+zlUnfhL6+vgsR8xmp+K1g7kH51TyNivOczfmhF7fF2dxOzubTBpJuVzDKUVDz3Tw+sl843W7jU/WuOAL5KVWPbW+RxwI3OPtR/veSJn7ZbpuIPAHqIkeAPwE5qhwjkF8g3webvxR7v7thuB76kB8/FChezSuHd7rZtba2Xiw7HqGZizl52vNHbP7A47G04pMa/O3xnwIWcRlvisgXaDJ4B5X0SxrjU1Ff4DxATbga19fxqrgt6gucB/CXLhrwJhrQFXUFChQoUKDA/wX/ACSu4B8VXIigAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABL0lEQVR4Xu2SMUoDQRSGY+EFgqAsy86unfWewBvYeAejKCrpvEAKryEpbAIBS+8QULAJKZSgaGFrCvV7MgkzLy/BNZWwH/yE/ebPe7MkjUbNv8M5187zvKX9MvjOLnkgX+RKn8/gsEsmvig51J1F0D0nn9NnLnkgM8KOyR8WSX9HOxZ2QjdHlUUM27Nuj/uwfESVRfRurYG4keUjKi56twbi7i0f4RcdaW/hu3MDcQPLR0ghy7Jj7S3ojq2BuDvLR/hFJ9pbuMW/0dDyEVLg33SqvQXdC2ug++2/jkVn2gu86X5RFJuhk36apk3tSD90EUmSbPjSpT6DNX8W3ZTnZzKaPnPJLemUZbke9n7g4Jq8kify6D9fyCTs8UY9XDt0Au7N929kCb1t3ampqVmdb2cUan2kjZlCAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABLElEQVR4XmNgGAVDDsjLy5coKChkoovjAkD1H4C4WVlZWRbIZQHqtQDyz6KrAwOgxHIg/gXE/6E4C10NLoCkB46BlhWiq8MA5FgENLgSiBcCcTq6PE5AhkV/0MWIAmRY9BtdjChAhkU/gXgqEH+Uk5NbAdVvha4OA0AVZqOL4wJAtZ+AceMO4ysqKpqBzJCRkRFCVocBQIqALstFFycFQB37CV0cBUAtykMXxwWMjY1Z0cWgFv1HF0cBIAXAoChAF8cGgA6KhRpaiixOikVYMxzQ4FBgHIjD+EC1SSD1wPiQRlYHNeMWshgKkJKSEoG6pgddDggYsbkUC38LuhgcACVWA/FrIH4CxI+h9Esg/oWsDuijDUCxEmQxJMd9hNLfgcKMyGpGwSgYBdQBAFTEY7yIRsBrAAAAAElFTkSuQmCC>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABL0lEQVR4Xu2SzUoCcRTFFdrWpqCYYb5gYPaBVA/SM0hFUeCmN2jhG7Rq1WIQfAt3QeADCLaRNra1z3PxjtzO6DhDboL5wcHx/M+517/aaNT8O4Ig6IRheMZ+EcjfofcOfeD5gc8XIPAIzaBv1TlnVoHsG3Qoz67r7mYzOJejyiJ8+iNkJ0mSbGee53ktnfFkszkqLpKvTPJD65e6VZVFArJpHMc75G1+EYPuic5I+ewXGrpgvyza/2I/hwR9379kvwzo9qBP9peii67YXwf+GG10p+yvRBahdM1+Ecgfozeynsyx73Poohv2Bdz0NIqifeshe4DOs/WEwkWO4+zpj9nlM9DUMztgK/OWaGByc2Cm0Cv0Ao31dQLNbA436sPrmN49DV8IN7213Zqamr/zAx8EaOmRtPOlAAAAAElFTkSuQmCC>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAZCAYAAAAR+1EuAAAFbUlEQVR4Xu1ZWYhcRRQNJoIYUVyG0Vm6ehaRgERxlOig4hJFHZePGKP+iBrUD/2JGDRIkIAiTFw+RsGAxgRRUFEMfoQoQciGRlDBBRQRjDFqYhYnYPbxnPfubW/fqdfdjt0TQupA8eqee+reenXfUq97ypSEhISEhOMJvb29p3V3d1/s+Wair6+vm3k83yp0dHScFUKY4fnjGVOxIEfQxnj0zmYAcd+X+GOlUmm29zcbyHOZ5kNb7/0W8O80WrZdaAfVLpfLK/yYYx5yci0ptoI5JqPYCjmnmsUm+vv724q0zVgXjN/ruaOKZpxUPRwDxf7Y+8ANi2/E+xoFx3vuqCIVO9N+5H14jD8hvgndndgHdbS82FjUuUiyCMfXaWPSF8Iehv2Ck2aIFburq+sMcCMY8zPa6s7OzjOtHzFnwX9RT0/PTPgHcGLnk0f/upC/NwfpVz1zQHu9LMDTaCvb29un/xsxR728FvAvhnYH2ufMa31yThvYZwzkvYRz5UYUrU91tYpNjj7EviPiuxtrsArHn2LrilznSVy2m9i4Tl6HGM8yBtqw9zUEBF2IwXsl0RHYt5BH4FeEG7R61UW4N9nnLpo2xj+lfvTvAveu6LaxkOR54sL9iTZH9cLtg/9m2ihAl8Ss2gTVy0uYAj1MGxfIuWIPqUbsTewjTklstnW8UCOxqooN+2Xhl1iewDkspw/dabRVi+4JqoG9AG29xGB/AfLepn6dE9btAqOf2FMAE7pdBk+1PLhRH1QmFCv2Y8Z+x48Tnrp9nrO2cmjzLYc59pLn0elq5hXNbrX5WUcOi3m21SDup+zzboa9Q30Wpth7MP4zHL8IsiOPPXkIxH2kYE4bHfeS1ylEvy7CvWe5hoATvDWWCNzVErSy8GLXfGfDv7Qg3hLL83EZ5I6zoAaLeW+MR9vieYXPi/45MmaR1XmIZjNyzgs13rk17uxN5FHY0y0fA77pT5YYlQuQCAXF1pyY24O4s9u1hfxGPOz1dYFBQ7FEwDSZWOUKErtKK++cw2h/l/ONyqteoyBfkv0B+nucOwM1NYpdiVsvL/qP0sZFdYVyMUjcA2g/sM/HptcQRcUmhI9eKOCXiX8j5nmP9KvOPRQUG9x88nzdos127Vqvr4tQUGwukkzseeXErmj5bqFt3zGwn4zFI8BvVR/GfO/9hMQrKvYB9hvJy72BjLlfuRiowcKtlv7uornX+fQiP25cLJ5o/3LciNWh/x2PZvNW9VqbMEJBsbGQa8jjeJJykthOqsomoH9ROe+D3SNjNvBxZH0KyRktNorygPZ97Fhe0W21OuHXmj41bzl7s9oKU+xPvE/4cWso/MoIN4r5lnG8j5ydu2qc/lu1FeWCm6UmghQb7UfDZe87BHzbaamzE+EmxRc027RI/5D1CVcVwyPmh/0b2qixG8qL+d9JDsd5qkN/BS60YMbRv8bY2esA3OPKCT9D5vaV5cVHni37hDTzILdNdeX8MZ7NE/2rcLxReH6ejuGCOlXGfa1jMNcr6SvJ1wmB/jPk1W4YQYrNHSWO+2WCnMwNRsb393a0X0L+KN5pxn+oY4K8z7i7DfmuNvvksAC/FP7FnlfA/6scvzFxl0V0DeXltzK4Q6Lbj/Mqk5dF/B1tS8jPa5fE5e/gep7ZBUaf2Kr9A7mWaw5Zu+y/A4T/IMirr62t7RTGIC9taGBg4EQcD0K3SscT4N4QzbgbRDZl9vf5yqfjfwKvGAbwfKuAXNs9lzBJwOLPaWWxg/sRAP0vrT9hkoBHyUNcfHk0vIa7fK7X/F8g7nNa7DCRb8OE5iDkv8UOouiXotCXo3+N1zQD5fw7uGpXmpCQkJCQkJCQMB7/AO+DcJoKJNHJAAAAAElFTkSuQmCC>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAZCAYAAAC2JufVAAACAElEQVR4Xu2Uvy9DURTH2y4IE2lK+uO1vIFF6EAaDYMuBgNRJIiJuYPJpn+AiFGsImLQhUEMwshgshMSsUgIEUnD9+jpc3p6X6WDQfK+ycnr/ZzvPffc23efz+fJ0x8pFAo1x+PxY8uyPhEXQH7tMYn9W7FYbAkxjxqzHDPgY+zpR5wgkhgG4OtEfgPPgir3o0gkEqbieDbROBwOt9EYPwPKWiVuyi3WyYPFM4bco65VIRhe0fmeYpeId8lMguc+kUgMYH43NmXTKYD1IF7KHuRGMD5EbCPywWCwRdYwijpHsWnFVolLpoV8CvPGDbxiHjxpNLYmWU1hl8PcVFpyFFkkjt23Sv6bMOfIKr07jlB7qK6mYM7R4oZCWeLID0peS/zXPWtOJ4rY4XV2EW+oe6Z9jmDIkxkn1qv4BBeZk7yW4C1Go9EuA08ibhSj2ueSOcLulsmAzvsUnyKO56jkbrJtO0h+zd0E74Orv/xOIVKSo5kF4vS5kNxN8N65LmIQvKfkx/ohnaMdNvCJ1H37pHhjRr8pZ5U+OfQPNUruiCdtKka3SF/trHFnPqfGk+Ykzu0r9qHrV8gynAoXmhTIz6yqEHbbThxN3+ocCbkr+iyIcQf56bMjfVWySle1yE+akNMeFC4gt6I5iRs+0Lws5K7Z831CqJXRHk+ePHn6L/oCpWepqOkNgTMAAAAASUVORK5CYII=>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAZCAYAAAC2JufVAAABvUlEQVR4Xu2VvS8EURTFlygUaNhgNzOzK5tsbRNBSDT+BbVSEEKyjZJKodDTKEQxkWh0CqHQiJCImlBYGhrF+jx3c9/muvNmzBYkkvklJzNz3rnv3XkzmUmlEhJ+Gc/zyrlcblr7USC/irpX6A3nW3ocfj90AJVw2ey6bh9y6zju6WwdhHegKvTJmtGZMJB95sVS2Wy208whM1h8XMxt9CAzkXBBrKZwt4PIVorFYrvxHMcZ4DnORG4M1/vQJrSSTqfbzFgsGmyKHhvlL6XPXn23sFOjyC7LTEM00hSBrF8oFDqUp5sa+dOmNKgd5jl85W2zT+/vC5o8knWRcOGs9uPC9R/KK0E3yqPcsfRCoTC2e077cUDtLvSufRvI3dNa2rfCTc1r/yfwOKZQ+6T9MJA9pLXy+Xy3HgtAQSywoP0okB9C3bX05C7wo/q2K7g+5bVapW+Fg4vaJ7CDE/rOkO1BzYX0CEtT9RefvdrHWnpWMplMF0+wpsdAk+WOW4xn0YkJ4fycPgviupcyuKFJ4wVAwIceoTvolo8VqCpz9K+CVxZ1G9xAQFhwSdbCu+Kx2g7Rr0eOJyQkJPwnvgA+1aDmvUqofQAAAABJRU5ErkJggg==>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAaCAYAAAADiYpyAAACrUlEQVR4Xu2Wy2tTURDGW+1GrOLCEAhJbhKiEVS0ogXBXf0LBHHvUsWC+CeID4pb0Y0ULC0IxYKLQovu3buoz1awWh9tfWHVNuo3dk6cft70nAjt6vxguOd8M3PunLn3nqStLRKJRAJJkuQm7DPsl1ixWOxPiak7v8b0cMxag/u+szWw31IqlfabWKl9imOa4rsJ9Pv5fL7K+nqCGq7hIVxvVqMD/mndyzz7fLQjaRR2Rxc4xgG+m68HqKFeKBQOSi25XG47+wX4hrPZ7GaJQdPOsn9VkNArN5CxNuKfTUNbYq0ZiD3PmqVcLmdZC8HVJVe8/ifYn8lkOmXzsIsa284xq4KkWTP+IItUq9WtTqtUKjtx4ytu7gOFHMEaD1kXZC34pln3IZtE3oCMtRE3OAb6d70upj1MLzZJzgGZwx4Z/6AU4uYhyIGKYh9bDW9CDWu9tlooWO+SO6O0vqfk75VPwvjfWH8Icj7ctYIu1GiOHbcCijuK3Ccy1ibMcEwoyF004xX1qTYsV31zxH/K+r3Y88FqulifzHH9Yf2t4JoBe8u+VrAbx/gjzV+6Md7Cy9ykIJA0x5qgjZCTdzeuF9gfCnIPwGZgk+wLpVarbUH+kJujphG3WVwP45PZ63yYL/1vI1KToI9rM57jRpvYH4I24c+ZgE+jO6HvOhTk9eFJ73Jz98aq79nfyMYDbPnt60DSPRaVDbpoaqN8IK8L9spq0gw+QEPAOj/tHJ/yHq1tRROw9jbVz1jdx0YkvEd3H7DDAf9X2ALrPrTQF6wL8B2Cb4L1ZqC+4/owOqyuGz5J2i2NDfv/gM7dTpYPnNlk+X9DnWMEPMF98J1m3QdyrrJmwae2g7U0sM4XrXEe9g12zvgaP+/Yzxjmn2BzGruQ6H+KSCQSiUQikcga8hsYLNdJLdKpMQAAAABJRU5ErkJggg==>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAABB0lEQVR4Xu2SPQrCQBCF408jiF26/LPYWNh4A2/gNSy8hI14B7GysLGwsBDtPYKNJzCiCApi0De4C5txk8ZKyAdDdt97TGaXtayCn/B9f4K6ol5UnudNDZlE+TLT5ZkUeph7BPSt4ziC6yZKCK9QC9mwxwNZP/kCYw9c1+3QOms6aE+uGUEw1tZnaiaEaCgtiqJmEAQjtc9Fn4TuRU631/yZbdt1tc+D7mupC/yopmMb0e9L12TDMe3xfeh+JgieuEao6dC4he+Q+0ayjgB9LRsecI817puoIrzhoqSspuOGiQqCRxxjxw0F/BvqzvUUeDNzhC6o2P+8q4RniDAM2/D6XC8o+GveBoJOcgwgL1UAAAAASUVORK5CYII=>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAABOUlEQVR4Xu2QvUpDQRCFY23ayy2u969VsbFOLaitrZXYiUUqC/EFfAkrQcHKZ5A0eQKxCFFBUBB/QDCQfAO7MnfYDams7oHD7sw5MzuznU6Lf0VRFGdlWX7BqePQejTQR8ordX3raUCZp1bzqOt6A/1UPAy0afUgMD+6CaKN0cbwbp6nAYzb8ADexorI37hz7lYNYBy4sx8qSpKky+pHziONr60nCN9M/k3uWZatGP1HzqqqtkTHt6r1KDA/qbsU7vuY+3GapstOG4Q2CkKmoPjQx1JI7kLFf2u7b1issUxhYikeu/uz1Xj0SueisBP4qfI878F1ld+RPNutaX8UmF9M/Oqa35v80A4RwxLGBzjSSeLLUAO/ic03gOEcvsM3+AknXmPVXbinvN/K+wF/+ecTr7do0WJBzABBKGzZ6Vst2gAAAABJRU5ErkJggg==>

[image17]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAaCAYAAADi4p8jAAAB2klEQVR4Xu2VvUoDQRDHowmoIIpFqtzlcskhgqCNb2BjLVaCvoCFT2AniNrbKH6ChY2FoIVopYIPIKKohWBnNCJ+IAb9D9kNk+EWEsQ7wf3BsNn/zOzNfiaRsFgsfwbP85Zhz7Avsmw2uxoSU9Z+FTMoY34bfLeE747BuvL5fCfaEWiPMs4In4D0EdAPHccJpB4VvD5tmUzGkXEmmpCwB9tWycMywDTxqKDvY9dm0C40fIKQMOm67gD91qsjY6B9Si1KwmqqGyQX2e8SDRYEQYfWcOa7c7ncrO7HwU8nWE2me6Z28YL5N9PpdLvuxwHVhEW+RHsGO1EnKiXjwqD7t8MFNcHqpBtZPd/3+xC/YbB1FLmGK7HiVV7vJdiiHCMMqgGnqoX1d+uqi98/rlEybJ76aD+4/y+AhepRNU5JXw0IeJAaoZLp5epFOy39MZAU/WZV47nQazFtM/R9NcAN7mWb9JtAvA+ba8TkGBLEXHmVO9iqNXoTSIMd8VhJCgEHUlToFQpdgCjBKbpFHS9cw2SHVH2jXOck4bxH8ql0aOB/hb1JPWoKhYKLOq65hv67sTbMfgvOJ1jRq/zvlWUMgRexH74JqccBNmJc7didao9ljMVisVgsln/ANyndnfqDasL5AAAAAElFTkSuQmCC>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAaCAYAAADrCT9ZAAACCklEQVR4Xu2Wu0sDQRDGk1o7iSlyySWk81UoCBYKVoLa2lqJnVgEFAuxsRIFe8VHLAIKVv4BgiBpUlmJWIREQVDwFRB8xG/IbhjHu+Qa74LsDz5udx67M7d3uYRCBoPh35BIJFZs236FqkoFGcOBv8hiKS8jY/wAdS9g7y+qA+M96W8Ka6IqfZpUKtUH/7LaZED6/QL7X8bj8WE2rzSq2xEklNWJuSbCV4LOG8X4gTwY3Px5ZcvxOFcQOA7NQCduzcB+rK4/NgsCVUNFz9HworJt8DhXEJhX14xTM5FIpB2LzqkYWvhIxgQJ6nlSdYelzxHdJL2XNI7FYpbwv9E1mUyOkR9xXdwfJKhnjWqyLKtX+lxBwg0bU0PTek7vRzQabVO+vNMT0AjEH7goixu4j/V3Md6BtqEtme9GOp3uRP4mcs6gMg6pQ8Y4QqeGTWf1nBqiQti8/viSj6TnrQJqWqW68BUZkb5f2Or9ZXNqqqTGt9KHm3HIbS1C2PNhyCCdSN85qIfZJ8iOp6GbxzfDrr1jniXzJYgZojpwmoPCXiVxmyMIuhPze5V8JewFTwv+MajhQtV3KuxNG6bH4BoqciPmOadELwv6AWroh96FLUu10e8Rt9eBcx16hB6gF+hD+/DITkJTLJb+tunYZ9oMCy9pfxBQfdSgXftn+KnGozLOYDAYDAaDwXe+AW+TvqiP0gEAAAAAAElFTkSuQmCC>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAaCAYAAADi4p8jAAAB20lEQVR4Xu2WPUsDQRCGLyqIIHbpkmwuHFoI2liKCP4DS2s7CwsL/4CN8QdYKH5EsLAwoIWFaGFnb2MjaUQF4weKQTHqO8msbCZ3MWk2QfaB4XbfmV1mdzO78TyHw9ExKKU2YC+wb7JUKrUVElPWfo6ZkjE2SKfTe5zDO3JYlP6GmAuQPgL6aSKRCKRuC8orCIIBsw/7MGMaEUPwESzPA6dlQNTCbeD7/gTndaI1tB9Jg2/IjA0Fxz2fTCbHqM0T1S0G2qfULNLDeWW1gPYbaeapRoLAotF+kgMzmcwgfv/Lut8JRB1EKGYg1RkPvjT8u/F4vF/32wyd5gXsC+2YdIZB9XdoCnJ3mt4pr1IvI4jfibAcfgnbKIlNVb2912Frco4oEDuDsav43mGeA+kPxaw/U6NFwVaor1q4rWyBnG4pR++vU0TQg9QIXiC9ecP4Lkl/u0FOC5zjjfTVwLtQB/RjnuAKddkn/VEg3odlWzE5hwQxOSVucWz8uGrioqGC/X1bBF3NTGADnQfqbtLQZlm/NkJr6IbzHjtxLh0aVX1rSlK3DXLIY3FnQnulBeI56zX1Cvyf7hlWVNV3ryxjCNyIo/DNSb0dII99PrECf0uhi3M4HA6Hw/G/+QFsFqLW0Lo3igAAAABJRU5ErkJggg==>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAaCAYAAADrCT9ZAAAB+0lEQVR4Xu2UPUsDQRCGI9j50UiIEJNLIBBQsVBELawFtbW1Eq3EIpWF2Ir4DyKKWgiKVv4GTRNBsBPBEBUCCvELhETjO2EXxvEulytyB7IPvNzuzLu7s7t3FwoZDIZ/QzweX7cs6x2qKeWlh4N8gXlpXEZ6/CCRSGxg7QpURXtP5l1hm6jJnCaZTA4hv0YeHNSIzPsF1n+BhqkdjUZ73Oq2BQPuLXXTMqdBrgidN/K0GtzmGNYvpdPpLh2LxWKjatOX3OsIjNPQAnTmtBnET9WTJrb1+IF6lamGax73VBeMOfXM2A0Kh8OdeIWXlYcmPpYeP6H1U6lUt4h52nDdSN8ltfFd9In8Jz1xulOUh6+f54MGNU14uggYH1ibNjSv+2ivRCKRDpXLNX2KCvgPHLRPf1fMv4v2DrQNZeX4ZqCaoG8Zt4VuDYsu6j4N5r95i52amtjThlsN6jmBvmTcEUt9v6xPmyqq9qPM4TCOeCxIUMsSairLeEPkjelbxK9+Ehpk8RmK420Y4H43MGbTi+R4J7DZcfjveIzq431bYCqJ/hMNhG5EPN/UhD6AzfailisZd6uvDYZbqMCD6B/aDVSH8CceAO26FhtdSHMdJLagMvQMvUFVncMrOwvNMe8H875CFZzwqs77DdbPsg3+UpB1GQwGg8FgMNT5ATZSwKMS36oWAAAAAElFTkSuQmCC>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAaCAYAAADi4p8jAAABgUlEQVR4Xu2Wu0rEQBSG10sjyHbpkkySDTaCNr6Bb+BrWPgSNuojrHgFCxsLCwvR3jfQxkbExl28gIK46H/IZBkOmywzsBmR88HPZv5zcnbO7swkrZYgCH8GpdQe9A79kOI4PhiRMyjjOmeV5zTILObwxc2xmA3wGAH/OgzDnPtNge+/HTfHOqZw0wV0pgus8QSXopMA83iznguW3EYURSt0XfULwfvmng+cGsQNPeP6hQrked4uvSzLFpIk2SrHPnFtcHgD7TP9L94Z8ZMgCObLsU9cGqT9d24ausFhEZuCaZouIf+4QkdYCYfYEvuqOL13oS6vUYeybdDcf6ZHRaAdGiuXY3lCWDeI5D73CN0gPfMW8bnJ475waXBkMvxL3eQ99uUcj1eB/BTathGvUYeybJDeCq64qZmmQjbFmsCmwRkkPmMJ3vBACeIf0Cf3faLnVN8gTrJTJL1CPVU89wY8h8CJuIzYOvd9oIr35SfoQesR6uOA7PBcQRAEQRD+Mb8Wvo+rWq+pyAAAAABJRU5ErkJggg==>

[image22]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAaCAYAAADrCT9ZAAABsElEQVR4Xu2WPUvDQBjH66xr6FCTSyGTiouzs6Curk7iJoKdHMRd/AaKoh0EBSc/g1Swn0AcSlUUFcQXEBXi/7EXefrYxCaxCcj94E/unre753KBFAoGg+Hf4DjOqlLqGfK16jKGA3+DxVJeRcZkCdY/lbauYE340hdQLpdH4V+hGBzUmPRnBdY+6Wa/kSDxQr+x0ALwNaHjqJgswT6WEu0FSZPQHHQUVgD2Q/1Mfqp/TJqGa/pZ6VTAsqwBXKMFHUMNH8iYPEjT8FcSfZc0LpVKg8L/Sk/XdSfIj7gh7s+LNA1fsjE1NBvMMV4sFov92leLuwDiqyHaxQHuoP42xlvQJrQh86NQSRqmt4ZF54M5FaCNsPn39SVf7AV6SKKGlf5+2ZyaaurxlfThMPa5LU+SNtyWELxF27bHoRFmnyI7bsMwj/8N5KzFkcyPQiVs+EbM76gIdCbs9djFe0zchvsQfA41uBHzvU5F9CH8sOeJat0K3/M8S/raQNA69ADdQ0/QR+DDlZ2GZljsC4t9hN7xHS8H/jzAHt6ga9X6O6S/P3reQlUZazAYDAaDwZApn4DbqN8EQ/biAAAAAElFTkSuQmCC>

[image23]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABfklEQVR4Xu2Uv0rEQBDGc6KI2KkQyMb8IalFDPgPsbGwVtRGRLDQ9gQttNQ3EHwAK7WzEAtfQX0Bn8I7EBUV/eaYwOxkkbtSyAfD3v7m253ZzXKeV+vfyPf94SRJ7uM4/kE8ADW0xyV4XxCnWZaNY9qPPWYxf9K+jsIwNFQA4xDNjTGjNMfPPmWtiBuzAsX2ta8jJF+RvFbsEfEumUu88RHiArGn85bIHEXRhmLHfKo/Bc+XZk6labrIhRYkR3fbxHGdI5JrwfOpmVPYsMl3OyU5Cq/ztcxIrgXPB+Ic0cKaK95rXvvIeEJJnGxC8RVetCm5FvJtNLNczrHPNK2r3AS62OXOJxVfI45xSfJuxA22LVh+I8Sc5CiwxZ0ZybWKohjQjPezH1Ke54Pcec+vrmwGcSi5s5BInCl2p830QHADvvDskEefmhg+xbNkZaLSPRdfFajh6tQxv9XMEpKXiG8eqaOm9uBEN8gdSBYEwRg30OLxzevyf7JWrVq96RckqHwy6ZdFewAAAABJRU5ErkJggg==>

[image24]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAaCAYAAADFTB7LAAAB80lEQVR4Xu1VPUsDQRCNEbQRuwhCkr2QKyToDxAttFAs7fQHWNlY2PgBomClNjZptcgPEAVREJQUNhLRxu9G0EZREBRJosY33q4Zh8Qo5E6Le/C4nff2ZuZ2724DAR8+/hGUUnPgA1jQfAbvhXYs7/McphmpE6Bny3megRqwLCstdUIoFGrQ/rT0PAEKD+oV7JaewXcr7DpQ+KhS8b9usGLxn8xxDbr4jtQNYrFYr57j/dds3j9cu6RnAP+c5sTj8SbpuQ4UPq20dXr1XqXuCXTxsg2q4gcUlJ4n0Ntb8v8HfYb8SCTSynXbtuuh58AtcB2cBVPk4ZoHh8G7aDTaqfOM64VYA2/BPfCA5ywJTJqkG5Goh+tI2K+coy7PdQPlbHeNHhfC4XAb857Y+HNnUGMK8TbzMtA2TPwFMJNUhBIwvijnSKOzOJVIJOrkfQY0Hw9hmTGdNMwOQltQ4t9KqwiusriP+1UFnnwEya/AC3De6Bi3g28s5g2O8QaRo8O1BpH4UWoE6PsovKTDWmoAbKaAGsQ4w+Ze0qqauKpA8lFd3DDHPFrZXRRfRLPLuJ6RTg0i3oR3A16DQ8WMVQaSH4o4iQYGuCaBORN8i10FimVRrIXG+OU0KvbelQKdQFi9Fcw7wX2W9F2D5RyPH78bHz5+gXe2YKxuIaNiUgAAAABJRU5ErkJggg==>

[image25]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAAZCAYAAAC4j5m6AAADG0lEQVR4Xu2YT4hNURzHxwyyUBZ6oTfz7pvXhB7ZPGEkGcpshCKFFVasEEqUBVPKThQrMTZE2Wgy8n/nz4hSlFkRjRpKEybM+Px654wzP+fd+wx3NDqf+nXP/f6+53d/58x5c99MTU0gEAgE/mvy+fwu4kIulyua+9lRFJ3nutPj7SQ3SHwgtup82oylXhOhqSOmQTcee3yDpVJpgoxZ1Ebje6d9aTKWek2E03OIpo7T4FmuB5HqtAe9A98VpV2VBTU0NKx29TQZS70mIgsgWrTuQv6bNM6C1luN8RzRiB7X66OxsXGe1lyosUNrPkaj11GDZg4kLaa+vj6L55yrceqWmcU8cnUfeF4Qi7UuoN+m1hqt+0izV3Lb8B3letncbyba9acET6ushetCrs2FQmEK4+n45ssB44dc4n6SO8cLpv0UaJPGmHRGrmintU+D95p4eeBcnfOB96VsgKtR4w76OleLI81eyR8Tj4n3bGhONpDxV2LA8e0m2o1vgJiBd6ady5zOTCYz2a3tRQpJY0qTIoddTVFnPA90Ig783ZE5sTR4l+du0J440u7V+AYr6M+VdsJ4xxO1jL+4+RFRqQELuc9RzMc2jqi8+Q+JTTo3Ev5mr5VqReVT79P7ovKp/65z1TBOC1LI9yAB/Rmn9aLWq4X5XUQ3vw9X6lwVpNprzMbf8+mCmXND64mYib0e7ZcHoV0i2pT2yr2PA2+X/bbBhjzlfrn2xJF2rzG1+n06a1iLfl1yjBfpfCzmYXs92rAHsWH7KL7d1Ti10/CddLVKRM6mW2Tz8+qFG0favfpqOfrQC1bIl1+8fSZ/yzcvFiZ8ampqyth72QgpQqOzrMZCVtimdOBvtb5K4LlPjVVaF6jxhNwSrftIu1fro95SR+sQLZvNTrWa9Gt8CxyfzP29FywTet0GKVxQ+aGcDtK1rtdH0qmO4r+VDCNKsVfro98tzrw39t8PxvOReC060S8aPZxi3GP0t8TNn1UDidjN1nogZcLG/wPY8D12483LOfnP/sCfw4a3EM0S8k4qFosTtScQCAQCgSR+APB7fUtKwFA6AAAAAElFTkSuQmCC>

[image26]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAZCAYAAACPQVaOAAAC9ElEQVR4Xu2WS2hTQRSGWyniE0GNkSbt3DSB0oiigoooKiq4FV/gUnCjrgXBBy7arSDoSkQQ7UqoOx8oQhFRfICoiKIouFBRLJZ2Ya3G7/TODaent01MoFW4Pxwy5z//zJwzc2cmDQ0JEkwpWltbi5lMJmt5jSAIFlvuv4Nz7ivWiZ3CXti4AD6HlSw/aWClT0oC2C/smI0LstlsgV174HW3bBxup/RX/hdsiLF7sW3Ydvw+6c/OL9B9Jw1MfhvbrPyj2HetIdGNkqTyl2tfgP8Je6j8w+3t7XOl3dzcPIufJhZrCXx3udNEyOVyqy1XJ6Yx+WdLSiHsZEb7FHjAaIaw+1qD3Yl89JsobkvkRxrtT4hisTidDu+xu7iNNv638J/WmAR8cYG08/n8IvHlV2sI39R9aV9z6pzS7kIzQ/mPa/18ZUeeYu/YgZk2WC3S6fRsvyOllpaWvHC0O3QR7M6JuAWBv6B5Cltjiref/eXIrxkuXNH+oMbrnL49UcHYE2xAxynqalyxcGctTw6nXXgJ9XPklintmP51wa/0MDu91MYqgX7PVcFyXstjUEBvXLK+sFFnOw5onqGZH/k+TznvK7SuJjBIlyTBym6wsTigHSSB3dKmgNdRwalUao6Pd8cVC3fG8002FoGjsQrNxcin/ZE5jvj2h4Z67x0GOSRJMOheG7NAd8mFl10ZFL7eFzxy2Yx3ZuHOx/EaJt5o9fg92q8aLvznIkmW38xKEH10MRn+eJQYxa6TdqXb2ILYy7a2tnnKX2v1+IParwgXrvBPrMPGKkEmp5hdMfx+7I3yS9gOoxnAvmkugi/snOFG3fKeq65YkryOuK9QKKRsrFowxh6bgEA4edMjH90NuGElGfkk2d1AcWUQ+205gZ3LVfiMZZJH2NtAPdj1gHH2SRIu3KlhafP3bqHVufBdH8SuiIYF2Go1AmKv5P22vIDYPeygb098Qfm/i+ML/gFQRKflNFz4rv/AVtpYggQJEiRIMEX4A93p58/fw54gAAAAAElFTkSuQmCC>