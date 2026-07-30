import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guards";
import { createMediaLibraryUpload } from "@/lib/providers/storage/media";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";
import { getCloudinaryConfig, signPayload } from "@/lib/cloudinary";

const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });

  const rate = await checkRateLimit(`media-upload:${getClientIp(req.headers)}`, 30, 3600);
  if (!rate.allowed) return NextResponse.json({ error: "Çok fazla yükleme denemesi. Lütfen sonra tekrar deneyin." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";
  if (!types[contentType]) {
    return NextResponse.json({ error: "Sadece JPG, PNG, WebP veya SVG dosyaları kabul edilir." }, { status: 400 });
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  if (cloudName && apiKey && apiSecret) {
    const folder = body?.folder ?? "media-library";
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign: Record<string, any> = { timestamp, folder };
    const signature = signPayload(paramsToSign, apiSecret);
    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      fields: { api_key: apiKey, timestamp, signature, folder },
      clientInfo: { cloudName, signed: true },
    });
  }

  const unsignedPreset = process.env.CLOUDINARY_UNSIGNED_UPLOAD_PRESET;
  if (cloudName && unsignedPreset) {
    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      fields: { upload_preset: unsignedPreset },
      clientInfo: { cloudName, signed: false, unsigned: true },
    });
  }

  try {
    return NextResponse.json(await createMediaLibraryUpload(contentType, types[contentType]));
  } catch (error) {
    const msg = (error as Error).message || "Depolama yapılandırma hatası.";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });

  const localKey = req.nextUrl.searchParams.get("localKey")?.trim();
  if (!localKey) return NextResponse.json({ error: "Dosya anahtarı eksik." }, { status: 400 });
  const contentType = req.headers.get("content-type") ?? "";
  if (!types[contentType]) return NextResponse.json({ error: "Sadece JPG, PNG, WebP veya SVG dosyaları kabul edilir." }, { status: 400 });

  const root = process.cwd();
  const targetPath = path.join(root, "public", ...localKey.split("/"));
  const allowedRoot = path.join(root, "public", "media-library");
  if (!targetPath.startsWith(allowedRoot)) return NextResponse.json({ error: "Geçersiz dosya yolu." }, { status: 400 });

  const buffer = Buffer.from(await req.arrayBuffer());
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);

  return NextResponse.json({ ok: true });
}
