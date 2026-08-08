import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getSurahMeta } from "@/lib/surahs";

export const runtime = "edge";

interface FontEntry {
  data: ArrayBuffer;
  weight: 400 | 700;
  name: string;
}

let fontCache: FontEntry[] | null = null;

async function loadFonts(): Promise<FontEntry[]> {
  if (fontCache) return fontCache;
  const fetchFont = async (
    weight: "400" | "700"
  ): Promise<FontEntry | null> => {
    try {
      const css = await fetch(
        `https://fonts.googleapis.com/css2?family=Amiri:wght@${weight}&display=swap`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      ).then((r) => r.text());
      const url = css.match(/url\((https:\/\/[^)]+\.woff2)\)/);
      if (!url) return null;
      const buf = await fetch(url[1]).then((r) => r.arrayBuffer());
      return { data: buf, weight: Number(weight) as 400 | 700, name: "Amiri" };
    } catch {
      return null;
    }
  };
  const fonts = (await Promise.all([fetchFont("400"), fetchFont("700")])).filter(
    Boolean
  ) as FontEntry[];
  fontCache = fonts;
  return fonts;
}

interface Params {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  const meta = getSurahMeta(s);

  let arabic = "";
  let translation = "";
  if (Number.isInteger(s) && s >= 1 && s <= 114 && Number.isInteger(a) && a >= 1) {
    try {
      const res = await fetch(`https://api.quran.gading.dev/surah/${s}`, {
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const j = (await res.json()) as {
          data: {
            verses: {
              number: { inSurah: number };
              text: { arab: string };
              translation: { id: string };
            }[];
          };
        };
        const v = j.data.verses.find((x) => x.number.inSurah === a);
        arabic = v?.text.arab ?? "";
        translation = v?.translation.id ?? "";
      }
    } catch {
      // biarkan kosong
    }
  }

  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #064e3b, #134e4a, #042f2e)",
          padding: 48,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#f8fafc",
            fontSize: 64,
            lineHeight: 1.5,
            fontFamily: "Amiri",
          }}
          dir="rtl"
        >
          {arabic}
        </div>
        {translation && (
          <div
            style={{
              display: "flex",
              marginTop: 32,
              color: "#a7f3d0",
              fontSize: 28,
              lineHeight: 1.6,
            }}
          >
            {translation}
          </div>
        )}
        <div style={{ display: "flex", marginTop: 40, color: "#f8fafc", fontSize: 22 }}>
          {meta?.nameId ?? `Surah ${s}`} · Ayat {a}
        </div>
        <div style={{ display: "flex", marginTop: 8, color: "#6ee7b7", fontSize: 18 }}>
          QalbiTahfidz — quran.ilmify.id
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  );
}
