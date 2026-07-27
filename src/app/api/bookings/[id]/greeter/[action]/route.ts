import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { canTransition } from "@/lib/booking/rules";
import { publishBookingUpdate } from "@/lib/realtime/pusher-server";

// POST /api/bookings/:id/greeter/:action  (action = "meet" | "handover")
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "GREETER") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id, action } = await params;
  if (action !== "meet" && action !== "handover") {
    return NextResponse.json({ error: "Geçersiz karşılamacı aksiyonu." }, { status: 400 });
  }
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (booking.greeterId !== (session.user as any).id) {
    return NextResponse.json({ error: "Bu iş size atanmamış." }, { status: 403 });
  }

  const target = action === "meet" ? "GREETER_CONFIRMED" : "EN_ROUTE";
  if (!canTransition(booking.status, target, booking.vehicleSize, Boolean(booking.greeterId))) {
    return NextResponse.json({ error: `${booking.status} → ${target} geçişi geçersiz.` }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: target, statusEvents: { create: { status: target, actorRole: "GREETER" } } },
  });

  await publishBookingUpdate({ bookingId: updated.id, code: updated.code, status: updated.status });

  return NextResponse.json({ booking: updated });
}
