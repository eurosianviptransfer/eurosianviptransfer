import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { validateAssignment, canTransition } from "@/lib/booking/rules";
import { enqueueWhatsAppMessage } from "@/lib/queue/queues";
import { publishBookingUpdate } from "@/lib/realtime/pusher-server";

// POST /api/bookings/:id/assign — Bölüm 2.2: araç/şoför + (zorunluysa) karşılamacı ataması
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Bu işlem için admin girişi gerekli." }, { status: 401 });
  }
  const body = await req.json().catch(() => null); // { vehicleId, driverId, greeterId?, driverFee, greeterFee? }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const validation = validateAssignment({
    vehicleSize: booking.vehicleSize,
    greeterId: body.greeterId,
    driverFee: body.driverFee,
    greeterFee: body.greeterFee,
  });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }
  if (!canTransition(booking.status, "ASSIGNED", booking.vehicleSize)) {
    return NextResponse.json({ error: `${booking.status} durumundan ASSIGNED'a geçilemez.` }, { status: 409 });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
  if (!vehicle || !vehicle.active || vehicle.size !== booking.vehicleSize) {
    return NextResponse.json({ error: "Aktif ve uygun araç seçilmelidir." }, { status: 400 });
  }
  const driver = body.driverId ? await prisma.user.findUnique({ where: { id: body.driverId } }) : null;
  if (!driver || driver.role !== "DRIVER" || !driver.active) {
    return NextResponse.json({ error: "Aktif bir şoför seçilmelidir." }, { status: 400 });
  }
  if (vehicle.driverId && vehicle.driverId !== driver.id) {
    return NextResponse.json({ error: "Araç kendi kayıtlı şoförüyle eşleşmelidir." }, { status: 400 });
  }
  if (body.greeterId) {
    const greeter = await prisma.user.findUnique({ where: { id: body.greeterId } });
    if (!greeter || greeter.role !== "GREETER" || !greeter.active) {
      return NextResponse.json({ error: "Aktif bir karşılamacı seçilmelidir." }, { status: 400 });
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const overlapping = await tx.booking.findFirst({
      where: {
        vehicleId: body.vehicleId,
        id: { not: booking.id },
        status: { in: ["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE"] },
        scheduledAt: {
          gte: new Date(new Date(booking.scheduledAt).getTime() - 2 * 3_600_000),
          lte: new Date(new Date(booking.scheduledAt).getTime() + 2 * 3_600_000),
        },
      },
    });
    if (overlapping) throw new Error(`OVERLAP:${overlapping.code}`);

    return tx.booking.update({
      where: { id },
      data: {
        status: "ASSIGNED",
        vehicleId: body.vehicleId,
        driverId: body.driverId,
        greeterId: body.greeterId ?? null,
        driverFee: body.driverFee,
        greeterFee: body.greeterFee ?? null,
        statusEvents: { create: { status: "ASSIGNED", actorRole: "ADMIN" } },
      },
      include: { vehicle: true, driver: true, greeter: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }).catch((error) => {
    const message = (error as Error).message;
    if (message.startsWith("OVERLAP:")) return { overlapCode: message.slice("OVERLAP:".length) } as const;
    throw error;
  });

  if ("overlapCode" in updated) {
    return NextResponse.json({ error: `Bu araç aynı zaman aralığında ${updated.overlapCode} işine atanmış.` }, { status: 409 });
  }

  // WhatsApp gönderimi kuyruğa alınır — Twilio/Meta API'nin yavaş yanıt vermesi
  // veya timeout olması bu atama isteğini (ve admin'in "Ata" butonunu) bloklamaz.
  if (updated.driver?.phone) {
    await enqueueWhatsAppMessage({
      toPhone: updated.driver.phone,
      templateName: "booking_assigned",
      variables: { code: updated.code, driverName: updated.driver.name, plate: updated.vehicle?.plate ?? "" },
    });
  }

  await publishBookingUpdate({
    bookingId: updated.id,
    code: updated.code,
    status: updated.status,
    driverName: updated.driver?.name,
    vehiclePlate: updated.vehicle?.plate,
  });

  return NextResponse.json({ booking: updated });
}
