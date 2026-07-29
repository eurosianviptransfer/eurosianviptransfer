import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createVehicleImageUpload } from "@/lib/providers/storage/r2";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";
import { getCloudinaryConfig, signPayload } from "@/lib/cloudinary";

const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(req: NextRequest) {
  const rate = await checkRateLimit(`vehicle-image:${getClientIp(req.headers)}`, 12, 3600);
  if (!rate.allowed) return NextResponse.json({ error: "Çok fazla fotoğraf yükleme denemesi." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";
  if (!types[contentType]) return NextResponse.json({ error: "Sadece JPG, PNG veya WebP fotoğraf kabul edilir." }, { status: 400 });

  // If cloudinary configured for signed uploads, return signature and upload info for direct browser upload
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  if (cloudName && apiKey && apiSecret) {
    const folder = body?.folder ?? `driver-applications/${new Date().getFullYear()}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign: Record<string, any> = { timestamp };
    if (folder) paramsToSign.folder = folder;
    const signature = signPayload(paramsToSign, apiSecret);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    return NextResponse.json({ uploadUrl, fields: { api_key: apiKey, timestamp, signature, folder }, clientInfo: { cloudName, signed: true } });
  }

  // If Cloudinary unsigned preset is provided in env, offer unsigned direct upload option (no server-side signature required)
  const unsignedPreset = process.env.CLOUDINARY_UNSIGNED_UPLOAD_PRESET;
  if (cloudName && unsignedPreset) {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    return NextResponse.json({ uploadUrl, fields: { upload_preset: unsignedPreset }, clientInfo: { cloudName, signed: false, unsigned: true } });
  }

  // Fallback to R2/local presign flow (existing implementation)
  try {
    return NextResponse.json(await createVehicleImageUpload(contentType, types[contentType]));
  } catch (error) {
    // Improve error message to suggest Cloudinary if R2 not configured
    const msg = (error as Error).message || "Depolama yapılandırma hatası.";
    return NextResponse.json({ error: msg + " Eğer R2/S3 yapılandırılmadıysa Cloudinary yüklemeyi etkinleştirmek için CLOUDINARY_URL veya CLOUDINARY_UNSIGNED_UPLOAD_PRESET environment değişkenlerini ayarlayın." }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  const localKey = req.nextUrl.searchParams.get("localKey")?.trim();
  if (!localKey) return NextResponse.json({ error: "Dosya anahtarı eksik." }, { status: 400 });
  const contentType = req.headers.get("content-type") ?? "";
  if (!types[contentType]) return NextResponse.json({ error: "Sadece JPG, PNG veya WebP fotoğraf kabul edilir." }, { status: 400 });

  const root = process.cwd();
  const targetPath = path.join(root, "public", ...localKey.split("/"));
  const allowedRoot = path.join(root, "public", "driver-applications");
  if (!targetPath.startsWith(allowedRoot)) return NextResponse.json({ error: "Geçersiz dosya yolu." }, { status: 400 });

  const buffer = Buffer.from(await req.arrayBuffer());
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);

  return NextResponse.json({ ok: true });
}
