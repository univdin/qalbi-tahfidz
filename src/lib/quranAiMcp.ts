import { createMcpClient } from "@/lib/mcpClient";

const quranAi = createMcpClient("https://mcp.quran.ai/");

export async function quranAiCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  return quranAi.callTool(name, args);
}

export interface QuranAiSearchResult {
  surah_number?: number;
  ayah_number?: number;
  verse_key?: string;
  text_uthmani?: string;
  text_translation?: string;
  surah_name?: string;
}

export async function quranAiSearch(
  query: string,
  limit = 10
): Promise<QuranAiSearchResult[]> {
  const raw = (await quranAiCall("search_quran", {
    query,
    limit,
  })) as unknown;
  if (Array.isArray(raw)) return raw as QuranAiSearchResult[];
  const o = raw as { results?: QuranAiSearchResult[] };
  return o.results ?? [];
}
