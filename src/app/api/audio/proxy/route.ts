import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_HOSTS = [
  "archive.org",
  "download.archive.org",
  "everyayah.com",
  "cdn.jsdelivr.net",
  "tarteel.nyc3.cdn.digitaloceanspaces.com",
];

function isAllowed(url: URL): boolean {
  return ALLOWED_HOSTS.some(
    (host) => url.hostname === host || url.hostname.endsWith(`.${host}`)
  );
}

export async function GET(request: NextRequest) {
  const audioUrl = request.nextUrl.searchParams.get("url");
  const fallbackUrl = request.nextUrl.searchParams.get("fallback");

  if (!audioUrl) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(audioUrl);
  } catch {
    return new NextResponse("Invalid URL parameter", { status: 400 });
  }

  if (!isAllowed(parsed)) {
    return new NextResponse("Host not authorized", { status: 403 });
  }

  const fetchHeaders: HeadersInit = {};
  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    fetchHeaders["Range"] = rangeHeader;
  }

  const tryFetch = async (target: string) => {
    const res = await fetch(target, {
      headers: fetchHeaders,
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return res;
  };

  try {
    let response = await tryFetch(audioUrl);

    if (!response && fallbackUrl) {
      let fallbackParsed: URL;
      try {
        fallbackParsed = new URL(fallbackUrl);
      } catch {
        fallbackParsed = parsed;
      }
      if (isAllowed(fallbackParsed)) {
        response = await tryFetch(fallbackUrl);
      }
    }

    if (!response) {
      return new NextResponse("Audio source unavailable", { status: 502 });
    }

    const proxyHeaders = new Headers();
    proxyHeaders.set("Content-Type", response.headers.get("content-type") || "audio/mpeg");
    proxyHeaders.set("Accept-Ranges", "bytes");
    proxyHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    proxyHeaders.set("Access-Control-Allow-Origin", "*");

    if (response.headers.has("content-range")) {
      proxyHeaders.set("Content-Range", response.headers.get("content-range")!);
    }
    if (response.headers.has("content-length")) {
      proxyHeaders.set("Content-Length", response.headers.get("content-length")!);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: proxyHeaders,
    });
  } catch {
    return new NextResponse("Proxy execution failed", { status: 500 });
  }
}
