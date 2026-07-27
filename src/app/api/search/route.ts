import { NextRequest, NextResponse } from "next/server";
import { searchSerper } from "@/lib/providers/search/serper";
import { checkRateLimit, getClientIp, readThroughCache } from "@/lib/security/request-controls";

export async function POST(req: NextRequest) {
  const rate = await checkRateLimit(`search:${getClientIp(req.headers)}`, 20, 60);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Çok fazla arama isteği. Lütfen daha sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  }

  const body = await req.json().catch(() => null);
  const query = typeof body?.q === "string" ? body.q.trim().slice(0, 160) : "";
  if (!query) {
    return NextResponse.json({ error: "q gerekli." }, { status: 400 });
  }

  try {
    const data = await readThroughCache("serper", query.toLowerCase(), 300, () => searchSerper({ q: query }));
    const results = Array.isArray(data.organic)
      ? data.organic.slice(0, 5).map((item: any) => ({
          title: item.title ?? "",
          link: item.link ?? "",
          snippet: item.snippet ?? "",
          location: item.address ?? item.location ?? "",
        }))
      : [];

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
