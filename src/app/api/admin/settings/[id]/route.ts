import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params;
  const item = await prisma.siteSetting.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ setting: item });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Eksik veri." }, { status: 400 });

  try {
    const updated = await prisma.siteSetting.update({
      where: { id },
      data: {
        value: body.value ?? undefined,
        locale: body.locale === undefined ? undefined : body.locale,
        updatedById: (session.user as any).id || undefined,
      },
    });
    return NextResponse.json({ setting: updated });
  } catch (err) {
    console.error("Update setting error:", err);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.siteSetting.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete setting error:", err);
    return NextResponse.json({ error: "Silme başarısız." }, { status: 500 });
  }
}
