const SYSTEM_DEFAULT =
  "Anda adalah asisten tafsir Al-Qur'an yang akurat dan amanah. Jawab berdasarkan KONTEKS yang diberikan, kutip setiap klaim dengan [surah:ayat], gunakan bahasa Indonesia yang jelas dan ramah anak. Jika konteks tidak cukup, katakan jujur.";

async function callOpenRouter(prompt: string, system: string): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "x-ai/grok-2-latest",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(40000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return j.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string, system: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${system}\n\n${prompt}` }] }],
        }),
        signal: AbortSignal.timeout(40000),
      }
    );
    if (!res.ok) return null;
    const j = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

/** Tiered: OpenRouter → Gemini (free). Return null bila semua gagal/tdk dikonfigurasi. */
export async function generateAnswer(
  prompt: string,
  system: string = SYSTEM_DEFAULT
): Promise<string | null> {
  const tiers = [callOpenRouter, callGemini];
  for (const call of tiers) {
    const out = await call(prompt, system);
    if (out) return out;
  }
  return null;
}
