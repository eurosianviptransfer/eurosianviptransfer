import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET /api/pricing-rules
export async function GET() {
  const rules = await prisma.pricingRule.findMany({ orderBy: { km: "asc" } });
  return NextResponse.json({ rules });
}

// POST /api/pricing-rules — Bölüm 6: admin yeni bölge/otel fiyat kuralı ekler
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json();
  if (!body.regionName || !body.km || !body.basePriceSmall || !body.basePriceLarge) {
    return NextResponse.json({ error: "regionName, km, basePriceSmall, basePriceLarge gerekli." }, { status: 400 });
  }

  const rule = await prisma.pricingRule.create({
    data: {
      regionName: body.regionName,
      km: Number(body.km),
      basePriceSmall: Number(body.basePriceSmall),
      basePriceLarge: Number(body.basePriceLarge),
    },
  });

  return NextResponse.json({ rule }, { status: 201 });
}
