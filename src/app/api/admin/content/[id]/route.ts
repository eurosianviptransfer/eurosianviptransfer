import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  const item = await prisma.contentEntry.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ content: item });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID gerekli." }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Eksik veri." }, { status: 400 });

  try {
    const updated = await prisma.contentEntry.update({ where: { id }, data: {
      title: body.title ?? undefined,
      body: body.body ?? undefined,
      meta: body.meta ?? undefined,
      slug: body.slug ?? undefined,
      locale: body.locale ?? undefined,
      type: body.type ?? undefined,
      published: typeof body.published === 'boolean' ? body.published : undefined,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
      updatedById: (session.user as any).id || undefined,
    }});
    return NextResponse.json({ content: updated });
  } catch (err) {
    console.error('Update content error:', err);
    return NextResponse.json({ error: 'Güncelleme başarısız.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  try {
    await prisma.contentEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete content error:', err);
    return NextResponse.json({ error: 'Silme başarısız.' }, { status: 500 });
  }
}
