import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CLOUDFLARE_WHISPER_MODEL = "@cf/openai/whisper-large-v3-turbo";

interface VerifyRequest {
  surah: number;
  ayahStart: number;
  ayahEnd: number;
}

const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

function stripTashkeel(text: string): string {
  return text
    .replace(DIACRITICS, "")
    .replace(/[^\u0621-\u063A\u0641-\u064A\u0609\u060A\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordOverlapScore(transcribed: string, expected: string): number {
  const transcribedWords = stripTashkeel(transcribed).split(" ");
  const expectedWords = stripTashkeel(expected).split(" ");

  if (expectedWords.length === 0) return 0;
  if (transcribedWords.length === 0) return 0;

  const expectedSet = new Set(expectedWords);
  let matched = 0;
  for (const word of transcribedWords) {
    if (word && expectedSet.has(word)) matched += 1;
  }

  const precision = matched / transcribedWords.length;
  const recall = matched / expectedWords.length;
  if (precision + recall === 0) return 0;
  return Math.round((2 * ((precision * recall) / (precision + recall))) * 100);
}

interface GadingVerseDto {
  number: { inSurah: number };
  text: { arab: string };
}

interface GadingResponse {
  data: {
    verses: GadingVerseDto[];
  };
}

async function fetchSurahArabic(surah: number): Promise<Map<number, string>> {
  const res = await fetch(`https://api.quran.gading.dev/surah/${surah}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error("Gagal mengambil teks surah dari sumber data.");
  }
  const json = (await res.json()) as GadingResponse;
  const map = new Map<number, string>();
  for (const v of json.data.verses) {
    map.set(v.number.inSurah, v.text.arab);
  }
  return map;
}

export async function POST(request: NextRequest) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return NextResponse.json(
      { error: "Cloudflare Workers AI belum dikonfigurasi." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const audioFile = formData.get("audio");
  const payload = JSON.parse(String(formData.get("payload") ?? "{}")) as VerifyRequest;

  if (!audioFile || !(audioFile instanceof File)) {
    return NextResponse.json({ error: "Audio tidak ditemukan." }, { status: 400 });
  }

  const { surah, ayahStart, ayahEnd } = payload;
  if (!surah || !ayahStart || !ayahEnd) {
    return NextResponse.json(
      { error: "Parameter surah/ayat tidak lengkap." },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const aiForm = new FormData();
    aiForm.append("audio", audioFile, "recording.webm");
    aiForm.append("model", CLOUDFLARE_WHISPER_MODEL);

    const aiRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_WHISPER_MODEL}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: aiForm,
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!aiRes.ok) {
      const body = await aiRes.text();
      console.error("Cloudflare Whisper error:", body);
      return NextResponse.json(
        { error: "Layanan transkripsi gagal memproses audio." },
        { status: 502 }
      );
    }

    const aiJson = (await aiRes.json()) as { result?: { text?: string } };
    const transcribed = aiJson.result?.text?.trim() ?? "";

    const surahText = await fetchSurahArabic(surah);
    const expectedParts: string[] = [];
    for (let i = ayahStart; i <= ayahEnd; i++) {
      const text = surahText.get(i);
      if (text) expectedParts.push(text);
    }
    const expected = expectedParts.join(" ");
    const score = wordOverlapScore(transcribed, expected);

    return NextResponse.json({
      transcribed,
      expected,
      score,
      verdict: score >= 80 ? "lancar" : score >= 60 ? "cukup" : "perlu_ulang",
    });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat verifikasi bacaan." },
      { status: 500 }
    );
  }
}
