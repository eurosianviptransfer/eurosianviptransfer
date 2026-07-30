import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function normalizeUrl(value: string) {
  return value.replace(/\/$/, "");
}

function r2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = normalizeUrl(process.env.R2_PUBLIC_BASE_URL ?? "");
  if (!accountId || !bucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !publicBaseUrl) return null;
  return { accountId, bucket, publicBaseUrl };
}

function appUrl() {
  return normalizeUrl(process.env.APP_URL || "http://localhost:3000");
}

function client(accountId: string) {
  return new S3Client({ region: "auto", endpoint: `https://${accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } });
}

/**
 * Creates an upload target for a CMS media-library file (logo, page image, etc.).
 * Falls back through: R2 presigned PUT -> local dev route (never used in production).
 */
export async function createMediaLibraryUpload(contentType: string, extension: string) {
  const config = r2Config();
  const key = `media-library/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;

  if (config) {
    const uploadUrl = await getSignedUrl(
      client(config.accountId),
      new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType }),
      { expiresIn: 600 }
    );
    return { uploadUrl, publicUrl: `${config.publicBaseUrl}/${key}`, method: "PUT" as const };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("R2 depolama yapılandırması eksik. Medya yükleme için R2 veya Cloudinary yapılandırın.");
  }

  return {
    uploadUrl: `/api/uploads/media?localKey=${encodeURIComponent(key)}`,
    publicUrl: `${appUrl()}/${key}`,
    method: "PUT" as const,
  };
}
