import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;

  const where: any = {};
  if (q) where.OR = [{ filename: { contains: q } }, { alt: { contains: q } }];

  const items = await prisma.mediaItem.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ results: items });
}

export async function POST(req: NextRequest) {
  // Media create already exists at /api/media; admin POST can reuse that. Redirect to existing.
  return NextResponse.json({ error: "Use /api/media to create media." }, { status: 405 });
}
