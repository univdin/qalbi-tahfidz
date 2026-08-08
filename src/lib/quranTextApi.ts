interface GadingVerseDto {
  number: { inSurah: number };
  text: { arab: string };
}

interface GadingResponse {
  data: { verses: GadingVerseDto[] };
}

export async function fetchExpectedAyahText(
  surah: number,
  ayahStart: number,
  ayahEnd: number
): Promise<string> {
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
  const parts: string[] = [];
  for (let i = ayahStart; i <= ayahEnd; i++) {
    const text = map.get(i);
    if (text) parts.push(text);
  }
  return parts.join(" ");
}
