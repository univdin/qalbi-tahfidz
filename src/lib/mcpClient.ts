const PROTOCOL_VERSION = "2025-03-26";

function lastSseJson(text: string): unknown {
  if (!text) throw new Error("empty MCP response");
  const blocks = text.split(/\r?\n\r?\n/);
  for (let i = blocks.length - 1; i >= 0; i--) {
    const dataLines = blocks[i]
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"));
    if (dataLines.length) {
      const payload = dataLines.map((l) => l.slice(5).trim()).join("\n");
      try {
        return JSON.parse(payload);
      } catch {
        // coba blok sebelumnya
      }
    }
  }
  return JSON.parse(text);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface McpClient {
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

export function createMcpClient(
  baseUrl: string,
  clientName = "qalbi-tahfidz"
): McpClient {
  let sessionId: string | null = null;
  let idCounter = 1;

  async function post(body: unknown): Promise<Record<string, unknown>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (sessionId) headers["Mcp-Session-Id"] = sessionId;

    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(baseUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(40000),
        });
        const sid = res.headers.get("mcp-session-id");
        if (sid) sessionId = sid;
        const text = await res.text();
        return lastSseJson(text) as Record<string, unknown>;
      } catch (err) {
        lastErr = err;
        await sleep(400 * (attempt + 1));
      }
    }
    throw lastErr ?? new Error("MCP request failed");
  }

  async function ensureInit(): Promise<void> {
    const json = await post({
      jsonrpc: "2.0",
      id: ++idCounter,
      method: "initialize",
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: clientName, version: "1.0.0" },
      },
    });
    if (json.result) {
      await post({ jsonrpc: "2.0", method: "notifications/initialized" });
    } else if ((json as { error?: { message?: string } }).error) {
      throw new Error(
        (json as { error?: { message?: string } }).error?.message ??
          "MCP init failed"
      );
    }
  }

  function extractResult(json: Record<string, unknown>): unknown {
    if (json.error) {
      throw new Error(
        (json.error as { message?: string }).message ?? "MCP tool error"
      );
    }
    const content = (
      json.result as { content?: { type: string; text?: string }[] } | undefined
    )?.content;
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

  async function callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (!sessionId) await ensureInit();
      const json = await post({
        jsonrpc: "2.0",
        id: ++idCounter,
        method: "tools/call",
        params: { name, arguments: args },
      });
      const errMsg =
        (json.error as { message?: string } | undefined)?.message ?? "";
      if (/not initialized|Bad Request|session/i.test(errMsg)) {
        sessionId = null;
        continue;
      }
      if (json.error) {
        throw new Error(errMsg || "MCP tool error");
      }
      return extractResult(json);
    }
    throw new Error("MCP server tidak tersedia.");
  }

  return { callTool };
}
