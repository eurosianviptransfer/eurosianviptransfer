import { NextRequest, NextResponse } from "next/server";
import { createVehicleImageUpload } from "@/lib/providers/storage/r2";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";

const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(req: NextRequest) {
  const rate = await checkRateLimit(`vehicle-image:${getClientIp(req.headers)}`, 12, 3600);
  if (!rate.allowed) return NextResponse.json({ error: "Çok fazla fotoğraf yükleme denemesi." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";
  if (!types[contentType]) return NextResponse.json({ error: "Sadece JPG, PNG veya WebP fotoğraf kabul edilir." }, { status: 400 });
  try { return NextResponse.json(await createVehicleImageUpload(contentType, types[contentType])); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 503 }); }
}
