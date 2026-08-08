const MCP_URL = "https://mcp.quran.us.kg/";
const PROTOCOL_VERSION = "2025-03-26";

let sessionId: string | null = null;
let idCounter = 1;

function nextId(): number {
  idCounter += 1;
  return idCounter;
}

async function mcpPost(body: unknown): Promise<{
  json: Record<string, unknown>;
  sessionId: string | null;
}> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;

  const text = await res.text();
  const dataLine = text
    .split("\n")
    .filter((l) => l.startsWith("data: "))
    .pop();
  const json = dataLine
    ? (JSON.parse(dataLine.slice(6)) as Record<string, unknown>)
    : (JSON.parse(text) as Record<string, unknown>);

  return { json, sessionId: sid };
}

async function mcpInitialize(): Promise<void> {
  const { json } = await mcpPost({
    jsonrpc: "2.0",
    id: nextId(),
    method: "initialize",
    params: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "qalbi-tahfidz", version: "1.0.0" },
    },
  });
  if (json.result) {
    await mcpPost({ jsonrpc: "2.0", method: "notifications/initialized" });
  } else if ((json as { error?: { message?: string } }).error) {
    throw new Error(
      (json as { error?: { message?: string } }).error?.message ?? "MCP init failed"
    );
  }
}

function extractResult(
  json: Record<string, unknown>
): unknown {
  if (json.error) {
    throw new Error(
      (json.error as { message?: string }).message ?? "MCP tool error"
    );
  }
  const content = (json.result as { content?: { type: string; text?: string }[] } | undefined)
    ?.content;
  const textPart = content?.find((c) => c.type === "text" && c.text);
  if (textPart?.text) {
    try {
      return JSON.parse(textPart.text);
    } catch {
      return textPart.text;
    }
  }
  return json.result;
}

export async function quranMcpCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!sessionId) await mcpInitialize();
    const { json } = await mcpPost({
      jsonrpc: "2.0",
      id: nextId(),
      method: "tools/call",
      params: { name, arguments: args },
    });
    const errorMessage = (json.error as { message?: string } | undefined)?.message ?? "";
    if (/not initialized|Bad Request|session/i.test(errorMessage)) {
      sessionId = null;
      continue;
    }
    if (json.error) {
      throw new Error(errorMessage || "MCP tool error");
    }
    return extractResult(json);
  }
  throw new Error("MCP server tidak tersedia.");
}
