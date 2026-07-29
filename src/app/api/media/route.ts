import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/request-controls";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const rate = await checkRateLimit(`media-create:${req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown"}`, 60, 3600);
  if (!rate.allowed) return NextResponse.json({ error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || !body.url) return NextResponse.json({ error: "Eksik medya verisi (url gerekli)." }, { status: 400 });

  try {
    const media = await prisma.mediaItem.create({
      data: {
        filename: body.filename || String(body.url).split("/").pop() || "upload",
        url: body.url,
        mime: body.mime || null,
        width: typeof body.width === "number" ? body.width : null,
        height: typeof body.height === "number" ? body.height : null,
        alt: body.alt || null,
        size: typeof body.size === "number" ? body.size : null,
        uploadedById: null,
        meta: body.meta ?? null,
      },
    });
    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("Media create error:", error);
    return NextResponse.json({ error: "Medya kaydı oluşturulamadı." }, { status: 500 });
  }
}
