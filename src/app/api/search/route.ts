import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";

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
    // Prefer Google Places Text Search when server API key is configured
    const googleKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
    if (googleKey) {
      // First try sending key in x-goog-api-key header (preferred)
      let gRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=tr`, {
        headers: { "x-goog-api-key": googleKey },
      });
      let gJson = await gRes.json().catch(() => null);

      // If header approach failed or returned non-OK status, try with key as query param as a fallback
      if (!gRes.ok || !gJson || (gJson.status && gJson.status !== "OK" && gJson.status !== "ZERO_RESULTS")) {
        gRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleKey}&language=tr`);
        if (!gRes.ok) {
          const t = await gRes.text();
          throw new Error(`Google Places arama başarısız: ${gRes.status} ${gRes.statusText} - ${t}`);
        }
        gJson = await gRes.json();
      }

      if (!gJson) {
        throw new Error("Google Places araması beklenmeyen bir yanıt döndü.");
      }
      if (gJson.status && gJson.status !== "OK" && gJson.status !== "ZERO_RESULTS") {
        // Google returned an error (e.g. REQUEST_DENIED). Log and fall back to Serper instead
        console.warn("Google Places returned status:", gJson.status, gJson.error_message);
        // Try Serper fallback below
      } else {
        const results = Array.isArray(gJson.results)
          ? gJson.results.slice(0, 7).map((item: any) => ({
              title: item.name || "",
              link: item.place_id ? `https://www.google.com/maps/place/?q=place_id:${item.place_id}` : "",
              snippet: item.formatted_address || "",
              location: item.formatted_address || "",
            }))
          : [];
        return NextResponse.json({ results });
      }
    }

    // No Serper fallback configured — return safe empty results so client handles gracefully
    return NextResponse.json({ results: [] });
  } catch (error) {
    const err = error as Error;
    // Any unexpected error — return safe empty results rather than throwing JSON parse errors on client
    console.error("/api/search error:", err);
    return NextResponse.json({ results: [] });
  }
}
