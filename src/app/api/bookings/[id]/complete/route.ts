import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { canTransition } from "@/lib/booking/rules";
import { enqueueWhatsAppMessage } from "@/lib/queue/queues";
import { publishBookingUpdate } from "@/lib/realtime/pusher-server";

// POST /api/bookings/:id/complete — Bölüm 2.2: admin "Tamamla" onayı → hakediş kaydı
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Bu işlem için admin girişi gerekli." }, { status: 401 });
  }
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  if (!canTransition(booking.status, "COMPLETED", booking.vehicleSize)) {
    return NextResponse.json({ error: `${booking.status} durumundan COMPLETED'a geçilemez.` }, { status: 409 });
  }
  if (booking.status !== "DROPPED_OFF") {
    return NextResponse.json({ error: "Sadece 'Otele Bırakıldı' durumundaki iş tamamlanabilir." }, { status: 409 });
  }

  // 15 günlük hakediş dönemi (Bölüm 7) — basit varsayım: ayın 1-15'i ve 16-sonu.
  const now = new Date();
  const day = now.getDate();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), day <= 15 ? 1 : 16);
  const periodEnd = day <= 15
    ? new Date(now.getFullYear(), now.getMonth(), 15)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (!booking.driverId || !booking.driverFee || (booking.greeterId && !booking.greeterFee)) {
    return NextResponse.json({ error: "Hakediş için atama ücretleri eksik." }, { status: 409 });
  }
  const driverId = booking.driverId;
  const driverFee = booking.driverFee;
  const greeterId = booking.greeterId;
  const greeterFee = booking.greeterFee;

  const updated = await prisma.$transaction(async (tx) => {
    const claimed = await tx.booking.updateMany({
      where: { id, status: "DROPPED_OFF" },
      data: { status: "COMPLETED" },
    });
    if (claimed.count !== 1) throw new Error("BOOKING_ALREADY_COMPLETED");

    const result = await tx.booking.update({
      where: { id },
      data: { statusEvents: { create: { status: "COMPLETED", actorRole: "ADMIN" } } },
      include: { driver: true, greeter: true },
    });
    await tx.payout.create({
      data: { bookingId: booking.id, userId: driverId, amount: driverFee, periodStart, periodEnd },
    });
    if (greeterId && greeterFee) {
      await tx.payout.create({
        data: { bookingId: booking.id, userId: greeterId, amount: greeterFee, periodStart, periodEnd },
      });
    }
    return result;
  }).catch((error) => {
    if ((error as Error).message === "BOOKING_ALREADY_COMPLETED") return null;
    throw error;
  });

  if (!updated) return NextResponse.json({ error: "Bu rezervasyon daha önce tamamlandı." }, { status: 409 });

  if (updated.driver?.phone) {
    await enqueueWhatsAppMessage({
      toPhone: updated.driver.phone,
      templateName: "payout_recorded",
      variables: { amount: String(booking.driverFee), code: booking.code },
    });
  }

  await publishBookingUpdate({ bookingId: updated.id, code: updated.code, status: updated.status });

  return NextResponse.json({ booking: updated });
}
