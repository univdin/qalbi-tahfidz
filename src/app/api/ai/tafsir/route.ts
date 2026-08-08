import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/core/supabase/server";
import { quranMcpCall } from "@/lib/quranMcp";
import { generateAnswer } from "@/lib/aiProvider";

export const runtime = "nodejs";

interface VerseSnippet {
  ref: string;
  arabic: string;
  translation: string;
  tafsir: string;
}

interface SearchResult {
  sura_id: number;
  aya_id: number;
  uthmani: string;
  standard_full?: string;
}

async function fetchTafsirSnippet(
  surah: number,
  ayah: number
): Promise<{ translation: string; tafsir: string }> {
  try {
    const res = await fetch(`https://api.quran.gading.dev/surah/${surah}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return { translation: "", tafsir: "" };
    const j = (await res.json()) as {
      data: {
        verses: {
          number: { inSurah: number };
          translation: { id: string };
          tafsir?: { id?: { short?: string } };
        }[];
      };
    };
    const v = j.data.verses.find((x) => x.number.inSurah === ayah);
    return {
      translation: v?.translation.id ?? "",
      tafsir: v?.tafsir?.id?.short ?? "",
    };
  } catch {
    return { translation: "", tafsir: "" };
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { question?: string };
  const question = (body.question ?? "").trim();
  if (!question || question.length < 4) {
    return NextResponse.json({ error: "Pertanyaan terlalu pendek." }, { status: 400 });
  }

  const { data: credit } = await supabase
    .from("user_credits")
    .select("balance")
    .eq("user_id", user.id)
    .maybeSingle();
  const balance = (credit as { balance?: number } | null)?.balance ?? 0;
  if (balance < 1) {
    return NextResponse.json(
      { error: "Kredit AI habis. Isi ulang untuk bertanya lagi." },
      { status: 402 }
    );
  }

  try {
    const search = (await quranMcpCall("search", {
      query: question,
      limit: 4,
    })) as { results?: SearchResult[] };
    const results = (search.results ?? []).slice(0, 4);

    const snippets: VerseSnippet[] = [];
    for (const r of results) {
      const { translation, tafsir } = await fetchTafsirSnippet(r.sura_id, r.aya_id);
      snippets.push({
        ref: `${r.sura_id}:${r.aya_id}`,
        arabic: r.uthmani ?? "",
        translation,
        tafsir,
      });
    }

    const context = snippets
      .map(
        (s) =>
          `[${s.ref}] Teks: ${s.arabic}\nTerjemahan: ${s.translation}\nTafsir Kemenag: ${s.tafsir}`
      )
      .join("\n\n");

    const prompt = `Pertanyaan: ${question}\n\nKonteks ayat & tafsir yang relevan:\n${context}`;

    const answer = await generateAnswer(prompt);
    if (!answer) {
      return NextResponse.json(
        { error: "Layanan AI belum dikonfigurasi (butuh OPENROUTER_API_KEY atau GEMINI_API_KEY)." },
        { status: 503 }
      );
    }

    const { error: deductError } = await supabase.rpc("deduct_user_credit", {
      p_user_id: user.id,
      p_cost: 1,
    });
    if (deductError) {
      console.warn("deduct credit failed:", deductError.message);
    }

    return NextResponse.json({ answer, citations: snippets.map((s) => s.ref) });
  } catch (err) {
    console.error("AI tafsir error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pertanyaan." },
      { status: 500 }
    );
  }
}
