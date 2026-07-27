import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { buildBookingQuote, bookingRequestSchema } from "@/lib/booking/quote";
import { quotePrice } from "@/lib/pricing/engine";
import { enqueueGuestNotification } from "@/lib/queue/queues";
import { StripePaymentProvider } from "@/lib/providers/payment/stripe-provider";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";

// POST /api/bookings — Misafir rezervasyon formu submit'i (Bölüm 2.1)
export async function POST(req: NextRequest) {
  const rate = await checkRateLimit(`booking-create:${getClientIp(req.headers)}`, 10, 60);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Çok fazla rezervasyon isteği. Lütfen daha sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  }

  const idempotencyKey = req.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 100) {
    return NextResponse.json({ error: "Idempotency-Key gerekli." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz istek." }, { status: 400 });
  }

  const existing = await prisma.booking.findUnique({
    where: { idempotencyKey },
    include: { paymentAttempts: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (existing) {
    const latestAttempt = existing.paymentAttempts[0];
    return NextResponse.json({
      booking: publicBooking(existing),
      checkoutUrl: latestAttempt?.checkoutUrl,
      replayed: true,
    });
  }

  let quote;
  try {
    if (parsed.data.regionName) {
      const rule = await prisma.pricingRule.findFirst({
        where: { regionName: parsed.data.regionName, active: true },
      });
      if (!rule) {
        return NextResponse.json({ error: "Bölge fiyat tablosunda bulunamadı." }, { status: 400 });
      }
      quote = quotePrice({
        rule,
        vehicleSize: parsed.data.vehicleSize,
        hasReturnLeg: parsed.data.hasReturnLeg,
      });
    } else {
      quote = await buildBookingQuote({
        originAirport: parsed.data.originAirport,
        destinationLat: parsed.data.destinationLat!,
        destinationLng: parsed.data.destinationLng!,
        destinationLabel: parsed.data.destinationText,
        vehicleSize: parsed.data.vehicleSize,
        hasReturnLeg: parsed.data.hasReturnLeg,
      });
    }
  } catch (e) {
    const message = (e as Error).message;
    const status = message.includes("Mesafe") || message.includes("GOOGLE_MAPS") || message.includes("Distance Matrix") ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }

  let booking;
  try {
    booking = await createBookingWithUniqueCode({
      idempotencyKey,
      guestName: parsed.data.guestName,
      guestPhone: parsed.data.guestPhone,
      guestEmail: parsed.data.guestEmail,
      guestLanguage: parsed.data.guestLanguage ?? "TR",
      originAirport: parsed.data.originAirport,
      destinationText: parsed.data.destinationText,
      destinationLat: parsed.data.destinationLat,
      destinationLng: parsed.data.destinationLng,
      regionName: quote.regionName,
      km: quote.km,
      flightNumber: parsed.data.flightNumber,
      scheduledAt: parsed.data.scheduledAt,
      passengers: parsed.data.passengers,
      luggage: parsed.data.luggage ?? 0,
      vehicleSize: parsed.data.vehicleSize,
      needsChildSeat: parsed.data.needsChildSeat ?? false,
      needsWheelchair: parsed.data.needsWheelchair ?? false,
      hasReturnLeg: parsed.data.hasReturnLeg ?? false,
      price: quote.total,
      paymentMethod: parsed.data.paymentMethod,
      promoCode: parsed.data.promoCode,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const raced = await prisma.booking.findUnique({
        where: { idempotencyKey },
        include: { paymentAttempts: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      if (raced) {
        return NextResponse.json({ booking: publicBooking(raced), checkoutUrl: raced.paymentAttempts[0]?.checkoutUrl, replayed: true });
      }
    }
    throw error;
  }

  let checkoutUrl: string | undefined;
  if (booking.paymentMethod === "PAY_NOW_CARD") {
    try {
      const payment = await new StripePaymentProvider().createPayment({
        bookingId: booking.code,
        amount: booking.price,
        currency: booking.currency,
        guestEmail: booking.guestEmail,
      });
      checkoutUrl = payment.checkoutUrl;
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentProviderReference: payment.providerReference,
          paymentStatus: "PENDING",
          paymentAttempts: {
            create: {
              provider: "stripe",
              providerReference: payment.providerReference,
              checkoutUrl: payment.checkoutUrl,
              status: "PENDING",
              amount: booking.price,
              currency: booking.currency,
            },
          },
        },
      });
    } catch {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "FAILED" },
      });
      return NextResponse.json(
        { error: "Kart ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin veya araçta ödeme seçin.", code: booking.code },
        { status: 502 },
      );
    }
  }

  // Bildirim checkout oluşturulduktan sonra kuyruğa alınır; ödeme durumu
  // yalnızca imzalı Stripe webhook'u ile PAID olur.
  await enqueueGuestNotification({
    toPhone: booking.guestPhone,
    targetLang: booking.guestLanguage,
    textTr: `Rezervasyonunuz alındı: ${booking.code}. Toplam ücret €${booking.price}. Admin onayı bekleniyor, en kısa sürede bilgilendirileceksiniz.`,
  });

  return NextResponse.json({
    booking: publicBooking({ ...booking, ...(checkoutUrl ? { paymentStatus: "PENDING" } : {}) }),
    quote,
    checkoutUrl,
  }, { status: 201 });
}

// GET /api/bookings?code=EVT-1234 — Misafirin takip linki
export async function GET(req: NextRequest) {
  const rate = await checkRateLimit(`booking-track:${getClientIp(req.headers)}`, 30, 60);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Çok fazla takip isteği. Lütfen daha sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code gerekli" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { code } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  return NextResponse.json({
    booking: {
      code: booking.code,
      originAirport: booking.originAirport,
      destinationText: booking.destinationText,
      flightNumber: booking.flightNumber,
      scheduledAt: booking.scheduledAt,
      price: booking.price,
      currency: booking.currency,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
    },
  });
}

async function createBookingWithUniqueCode(data: Omit<Prisma.BookingUncheckedCreateInput, "code">) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `EVT-${randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase()}`;
    try {
      return await prisma.booking.create({ data: { ...data, code } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && !data.idempotencyKey) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Rezervasyon kodu üretilemedi.");
}

function publicBooking(booking: Record<string, unknown>) {
  const { paymentProviderReference: _paymentProviderReference, idempotencyKey: _idempotencyKey, paymentAttempts: _paymentAttempts, ...safeBooking } = booking;
  return safeBooking;
}
