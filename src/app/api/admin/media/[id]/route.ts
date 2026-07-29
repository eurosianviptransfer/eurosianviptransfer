import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function DELETE(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { params } = (req as any);
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  try {
    await prisma.mediaItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete media error:', err);
    return NextResponse.json({ error: 'Silme başarısız.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { params } = (req as any);
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ media: item });
}
