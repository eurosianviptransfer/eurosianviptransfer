import { NextRequest, NextResponse } from "next/server";
import { buildBookingQuote, quoteRequestSchema } from "@/lib/booking/quote";
import { checkRateLimit, getClientIp, readThroughCache } from "@/lib/security/request-controls";

/**
 * POST /api/quote
 * Body: { destinationLat, destinationLng, destinationLabel, vehicleSize, hasReturnLeg }
 *
 * Misafir Google Places Autocomplete'te bir adres seçer seçmez bu endpoint
 * çağrılır ve fiyat "anlık ve otomatik" hesaplanır (Bölüm 2.1). Tabloda tam
 * eşleşen bölge yoksa km bazlı interpolasyonla tahmini fiyat döner ve
 * isEstimate:true işaretler — admin panelinde bu bölge kalıcı olarak
 * PricingRule'a eklenebilir.
 */
export async function POST(req: NextRequest) {
  const rate = await checkRateLimit(`quote:${getClientIp(req.headers)}`, 30, 60);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Çok fazla fiyat isteği. Lütfen daha sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  }

  const parsed = quoteRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz istek." }, { status: 400 });
  }

  try {
    const quote = await readThroughCache(
      "quote",
      JSON.stringify(parsed.data),
      60,
      () => buildBookingQuote(parsed.data),
    );
    return NextResponse.json(quote);
  } catch (e) {
    const message = (e as Error).message;
    const status = message.includes("Mesafe") ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
