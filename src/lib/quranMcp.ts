import { createMcpClient } from "@/lib/mcpClient";

const adelpro = createMcpClient("https://mcp.quran.us.kg/");

export async function quranMcpCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  return adelpro.callTool(name, args);
}
