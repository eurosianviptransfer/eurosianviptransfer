import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// Raporlama için audit kayıtlarını filtreler: /api/fleet/audit?entityType=USER&action=DEACTIVATED
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const params = req.nextUrl.searchParams;
  const entityType = params.get("entityType");
  const action = params.get("action");
  const limit = Math.min(Math.max(Number(params.get("limit") || 100), 1), 500);
  const logs = await prisma.assetAuditLog.findMany({
    where: {
      ...(entityType ? { entityType } : {}),
      ...(action ? { action: action as any } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { id: true, name: true, email: true } } },
  });
  return NextResponse.json({ logs });
}
