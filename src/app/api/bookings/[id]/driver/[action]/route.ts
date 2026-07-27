import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { canTransition } from "@/lib/booking/rules";
import { publishBookingUpdate } from "@/lib/realtime/pusher-server";

// POST /api/bookings/:id/driver/:action  (action = "pickup" | "dropoff")
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "DRIVER") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id, action } = await params;
  if (action !== "pickup" && action !== "dropoff") {
    return NextResponse.json({ error: "Geçersiz şoför aksiyonu." }, { status: 400 });
  }
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (booking.driverId !== (session.user as any).id) {
    return NextResponse.json({ error: "Bu iş size atanmamış." }, { status: 403 });
  }

  const target = action === "pickup" ? "EN_ROUTE" : "DROPPED_OFF";
  if (!canTransition(booking.status, target, booking.vehicleSize, Boolean(booking.greeterId))) {
    return NextResponse.json({ error: `${booking.status} → ${target} geçişi geçersiz.` }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: target, statusEvents: { create: { status: target, actorRole: "DRIVER" } } },
  });

  await publishBookingUpdate({ bookingId: updated.id, code: updated.code, status: updated.status });

  return NextResponse.json({ booking: updated });
}
