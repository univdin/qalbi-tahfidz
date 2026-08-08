import { NextRequest, NextResponse } from "next/server";
import { scoreRecitation } from "@/lib/recitationScore";
import { fetchExpectedAyahText } from "@/lib/quranTextApi";

export const runtime = "nodejs";

const CLOUDFLARE_WHISPER_MODEL = "@cf/openai/whisper-large-v3-turbo";

interface VerifyRequest {
  surah: number;
  ayahStart: number;
  ayahEnd: number;
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

    const expected = await fetchExpectedAyahText(surah, ayahStart, ayahEnd);
    const { score, verdict } = scoreRecitation(transcribed, expected);

    return NextResponse.json({ transcribed, expected, score, verdict });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat verifikasi bacaan." },
      { status: 500 }
    );
  }
}
