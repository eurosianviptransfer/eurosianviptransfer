import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { rankAssignmentCandidates } from "@/lib/assignment/scoring";

export async function GET(req: NextRequest) {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const bookingId = req.nextUrl.searchParams.get("bookingId");
  const booking = bookingId ? await prisma.booking.findUnique({ where: { id: bookingId }, select: { scheduledAt: true, vehicleSize: true } }) : null;
  if (!booking) return NextResponse.json({ error: "Rezervasyon bulunamadı." }, { status: 404 });
  const users = await prisma.user.findMany({ where: { role: { in: ["DRIVER", "GREETER"] }, active: true }, select: { id: true, name: true, role: true, ratingsReceived: { select: { score: true } } } });
  const candidates = await Promise.all(users.map(async user => ({
    id: user.id, name: user.name, role: user.role,
    averageRating: user.ratingsReceived.length ? user.ratingsReceived.reduce((sum, rating) => sum + rating.score, 0) / user.ratingsReceived.length : 3,
    ratingCount: user.ratingsReceived.length,
    activeJobs: await prisma.booking.count({ where: { driverId: user.role === "DRIVER" ? user.id : undefined, greeterId: user.role === "GREETER" ? user.id : undefined, status: { in: ["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE"] }, scheduledAt: { gte: new Date(booking.scheduledAt.getTime() - 2 * 3_600_000), lte: new Date(booking.scheduledAt.getTime() + 2 * 3_600_000) } } }),
  })));
  return NextResponse.json({ booking, drivers: rankAssignmentCandidates(candidates.filter(item => item.role === "DRIVER")), greeters: rankAssignmentCandidates(candidates.filter(item => item.role === "GREETER")) });
}
