import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Stripe webhook yapılandırması eksik." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Geçersiz Stripe imzası." }, { status: 400 });
  }

  const paymentObject = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent;
  const reference = paymentObject.id;
  const metadataBookingCode = paymentObject.metadata?.bookingId;
  const attempt = await prisma.paymentAttempt.findUnique({ where: { providerReference: reference } });
  const booking = attempt
    ? await prisma.booking.findUnique({ where: { id: attempt.bookingId } })
    : metadataBookingCode
      ? await prisma.booking.findUnique({ where: { code: metadataBookingCode } })
      : null;
  if (!booking) return NextResponse.json({ received: true });

  const isPaid = event.type === "checkout.session.completed"
    && (paymentObject as Stripe.Checkout.Session).payment_status === "paid";
  const isFailed = event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed";

  if (isPaid) {
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "PAID", paidAt: new Date(), paymentProviderReference: reference },
      }),
      ...(attempt ? [prisma.paymentAttempt.update({ where: { id: attempt.id }, data: { status: "PAID", providerReference: reference } })] : []),
    ]);
  } else if (isFailed && booking.paymentStatus !== "PAID") {
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "FAILED", paymentProviderReference: reference },
      }),
      ...(attempt ? [prisma.paymentAttempt.update({ where: { id: attempt.id }, data: { status: "FAILED" } })] : []),
    ]);
  }

  return NextResponse.json({ received: true });
}
