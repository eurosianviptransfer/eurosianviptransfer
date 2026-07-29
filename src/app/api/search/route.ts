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
    const err = error as Error;
    // If Serper auth failed and Google Maps server key is available, fallback to Google Places Text Search
    if ((err.message || "").toLowerCase().includes("serper api yetkisi reddedildi") || (err.message || "").toLowerCase().includes("401") || (err.message || "").toLowerCase().includes("403")) {
      const googleKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
      if (googleKey) {
        try {
          const gRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleKey}&language=tr`);
          if (!gRes.ok) {
            const t = await gRes.text();
            return NextResponse.json({ error: `Google Places fallback başarısız: ${gRes.status} ${gRes.statusText} - ${t}` }, { status: 502 });
          }
          const gJson = await gRes.json();
          const results = Array.isArray(gJson.results)
            ? gJson.results.slice(0, 7).map((item: any) => ({
                title: item.name || "",
                link: item.place_id ? `https://www.google.com/maps/place/?q=place_id:${item.place_id}` : "",
                snippet: item.formatted_address || "",
                location: item.formatted_address || "",
              }))
            : [];
          return NextResponse.json({ results });
        } catch (gErr) {
          return NextResponse.json({ error: `Arama hizmetleri geçici olarak kullanılamıyor: ${(gErr as Error).message}` }, { status: 502 });
        }
      }

      return NextResponse.json({ error: "Serper yetkisi reddedildi. Lütfen SERPER_API_KEY veya GOOGLE_MAPS_SERVER_API_KEY environment değişkeninizi kontrol edin." }, { status: 502 });
    }

    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
