import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(_req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  }

  try {
    const [
      totalBookings,
      approvedBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      paidRevenue,
      vehicleCount,
      driverCount,
      greeterCount,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "APPROVED" } }),
      prisma.booking.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.aggregate({
        _sum: { price: true },
        where: { paymentStatus: "PAID" },
      }).then((r) => r._sum.price ?? 0),
      prisma.vehicle.count({ where: { active: true } }),
      prisma.user.count({ where: { role: "DRIVER", active: true } }),
      prisma.user.count({ where: { role: "GREETER", active: true } }),
    ]);

    return NextResponse.json({
      totalBookings,
      approvedBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      paidRevenue,
      vehicleCount,
      driverCount,
      greeterCount,
    });
  } catch (error) {
    console.error("GET /api/admin/overview error:", error);
    return NextResponse.json({ error: "Dashboard verileri yüklenemedi." }, { status: 500 });
  }
}
