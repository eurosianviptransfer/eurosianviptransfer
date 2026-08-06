import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(Number(url.searchParams.get("page") ?? "1"), 1);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "50"), 1), 100);
  const skip = (page - 1) * limit;

  try {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.booking.count(),
    ]);

    return NextResponse.json({ bookings, total, page, limit });
  } catch (error) {
    console.error("GET /api/admin/bookings error:", error);
    return NextResponse.json({ error: "Rezervasyon listesi yüklenemedi." }, { status: 500 });
  }
}
