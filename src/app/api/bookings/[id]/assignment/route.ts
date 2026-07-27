import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { validateAssignment } from "@/lib/booking/rules";
import { enqueueWhatsAppMessage } from "@/lib/queue/queues";
import { publishBookingUpdate } from "@/lib/realtime/pusher-server";

const EDITABLE_STATUSES = ["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE"] as const;

/** Admin operasyon sırasında canlı işin araç/şoför/karşılamacı atamasını günceller. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Bu işlem için admin girişi gerekli." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (!EDITABLE_STATUSES.includes(booking.status as (typeof EDITABLE_STATUSES)[number])) {
    return NextResponse.json({ error: `${booking.status} durumundaki iş düzenlenemez.` }, { status: 409 });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
  if (!vehicle || !vehicle.active) return NextResponse.json({ error: "Araç bulunamadı veya pasif." }, { status: 400 });
  if (vehicle.size !== booking.vehicleSize) {
    return NextResponse.json({ error: "Bu rezervasyon için aynı araç tipi seçilmelidir." }, { status: 400 });
  }

  const driverId = body.driverId || vehicle.driverId;
  const driver = driverId
    ? await prisma.user.findUnique({ where: { id: driverId } })
    : null;
  if (!driver || driver.role !== "DRIVER" || !driver.active) {
    return NextResponse.json({ error: "Aktif bir şoför seçilmelidir." }, { status: 400 });
  }
  if (vehicle.driverId && vehicle.driverId !== driver.id) {
    return NextResponse.json({ error: "Araç kendi kayıtlı şoförüyle eşleşmelidir." }, { status: 400 });
  }

  const greeter = body.greeterId
    ? await prisma.user.findUnique({ where: { id: body.greeterId } })
    : null;
  if (body.greeterId && (!greeter || greeter.role !== "GREETER" || !greeter.active)) {
    return NextResponse.json({ error: "Aktif bir karşılamacı seçilmelidir." }, { status: 400 });
  }

  const validation = validateAssignment({
    vehicleSize: booking.vehicleSize,
    greeterId: body.greeterId,
    driverFee: Number(body.driverFee),
    greeterFee: body.greeterFee == null ? null : Number(body.greeterFee),
  });
  if (!validation.valid) return NextResponse.json({ error: validation.reason }, { status: 400 });

  const updated = await prisma.$transaction(async (tx) => {
    const overlapping = await tx.booking.findFirst({
      where: {
        vehicleId: vehicle.id,
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
        vehicleId: vehicle.id,
        driverId: driver.id,
        greeterId: body.greeterId || null,
        driverFee: Number(body.driverFee),
        greeterFee: body.greeterFee == null ? null : Number(body.greeterFee),
        statusEvents: { create: { status: booking.status, actorRole: "ADMIN" } },
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

  if (updated.driver?.phone && updated.driver.id !== booking.driverId) {
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
