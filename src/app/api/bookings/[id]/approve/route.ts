import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { canTransition } from "@/lib/booking/rules";
import { publishBookingUpdate } from "@/lib/realtime/pusher-server";

// POST /api/bookings/:id/approve — Admin onayı (Bölüm 2.2)
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Bu işlem için admin girişi gerekli." }, { status: 401 });
  }
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  if (!canTransition(booking.status, "APPROVED", booking.vehicleSize)) {
    return NextResponse.json({ error: `${booking.status} durumundan APPROVED'a geçilemez.` }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: "APPROVED",
      statusEvents: { create: { status: "APPROVED", actorRole: "ADMIN" } },
    },
  });

  await publishBookingUpdate({ bookingId: updated.id, code: updated.code, status: updated.status });

  return NextResponse.json({ booking: updated });
}
