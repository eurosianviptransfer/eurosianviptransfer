import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;
  const locale = url.searchParams.get("locale") || undefined;

  const where: any = {};
  if (q) where.OR = [{ key: { contains: q } }, { title: { contains: q } }, { body: { contains: q } }];
  if (locale) where.locale = locale;

  const items = await prisma.contentEntry.findMany({ where, orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ results: items });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.key) return NextResponse.json({ error: "Eksik içerik verisi (key gerekli)." }, { status: 400 });

  try {
    const created = await prisma.contentEntry.create({
      data: {
        key: body.key,
        locale: body.locale || "tr",
        type: body.type || "PAGE",
        title: body.title || null,
        body: body.body || null,
        meta: body.meta ?? null,
        slug: body.slug || null,
        published: !!body.published,
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        updatedById: (session.user as any).id || null,
      },
    });
    return NextResponse.json({ content: created }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Bu anahtar (key) ve dil kombinasyonu zaten kayıtlı." }, { status: 409 });
    }
    console.error("Create content error:", err);
    return NextResponse.json({ error: "İçerik oluşturulamadı." }, { status: 500 });
  }
}
