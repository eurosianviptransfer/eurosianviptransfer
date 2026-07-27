import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// PATCH /api/pricing-rules/:id — fiyat güncelleme (Bölüm 6: admin her an değiştirebilmeli)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const rule = await prisma.pricingRule.update({
    where: { id },
    data: {
      ...(body.km !== undefined && { km: Number(body.km) }),
      ...(body.basePriceSmall !== undefined && { basePriceSmall: Number(body.basePriceSmall) }),
      ...(body.basePriceLarge !== undefined && { basePriceLarge: Number(body.basePriceLarge) }),
      ...(body.active !== undefined && { active: !!body.active }),
    },
  });

  return NextResponse.json({ rule });
}

// DELETE /api/pricing-rules/:id — kalıcı silme yerine deaktif eder (geçmiş booking'lerde referans bütünlüğü için)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const rule = await prisma.pricingRule.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ rule });
}
