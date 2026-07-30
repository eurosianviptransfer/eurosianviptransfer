import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });

  const url = new URL(req.url);
  const key = url.searchParams.get("key") || undefined;
  const locale = url.searchParams.get("locale") || undefined;

  const where: any = {};
  if (key) where.key = key;
  if (locale) where.locale = locale;

  const items = await prisma.siteSetting.findMany({ where, orderBy: { key: "asc" } });
  return NextResponse.json({ results: items });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.key || body.value === undefined) {
    return NextResponse.json({ error: "Eksik veri (key ve value gerekli)." }, { status: 400 });
  }

  const locale = body.locale || null;
  const userId = (session.user as any).id || null;

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key_locale: { key: body.key, locale } },
      update: { value: body.value, updatedById: userId },
      create: { key: body.key, locale, value: body.value, updatedById: userId },
    });
    return NextResponse.json({ setting }, { status: 201 });
  } catch (err) {
    console.error("Upsert setting error:", err);
    return NextResponse.json({ error: "Ayar kaydedilemedi." }, { status: 500 });
  }
}
