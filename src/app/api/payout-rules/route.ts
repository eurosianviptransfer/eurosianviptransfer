import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET /api/payout-rules — atama formunda "önerilen ücret" olarak kullanılır
export async function GET() {
  const rules = await prisma.payoutRule.findMany({ where: { active: true } });
  return NextResponse.json({ rules });
}

// POST /api/payout-rules — Bölüm 3: araç tipine göre önerilen şoför/karşılamacı ücreti
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json();
  if (!body.vehicleSize || !body.suggestedDriverFee) {
    return NextResponse.json({ error: "vehicleSize ve suggestedDriverFee gerekli." }, { status: 400 });
  }

  // Aynı araç tipi için zaten bir kural varsa güncelle, yoksa oluştur (tek kural/tip).
  const existing = await prisma.payoutRule.findFirst({ where: { vehicleSize: body.vehicleSize, active: true } });
  const rule = existing
    ? await prisma.payoutRule.update({
        where: { id: existing.id },
        data: {
          suggestedDriverFee: Number(body.suggestedDriverFee),
          suggestedGreeterFee: body.suggestedGreeterFee ? Number(body.suggestedGreeterFee) : null,
        },
      })
    : await prisma.payoutRule.create({
        data: {
          vehicleSize: body.vehicleSize,
          suggestedDriverFee: Number(body.suggestedDriverFee),
          suggestedGreeterFee: body.suggestedGreeterFee ? Number(body.suggestedGreeterFee) : null,
        },
      });

  return NextResponse.json({ rule });
}
