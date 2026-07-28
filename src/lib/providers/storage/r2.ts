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

export async function createVehicleImageUpload(contentType: string, extension: string) {
  const config = r2Config();
  if (config) {
    const key = `driver-applications/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const uploadUrl = await getSignedUrl(client(config.accountId), new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType }), { expiresIn: 600 });
    return { uploadUrl, publicUrl: `${config.publicBaseUrl}/${key}` };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("R2 depolama yapılandırması eksik. Yerel yükleme yalnızca geliştirme ortamında desteklenir.");
  }

  const key = `driver-applications/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  return {
    uploadUrl: `/api/uploads/vehicle-image?localKey=${encodeURIComponent(key)}`,
    publicUrl: `${appUrl()}/${key}`,
  };
}

export function isAllowedVehicleImageUrl(value: string) {
  const config = r2Config();
  if (config) return value.startsWith(`${config.publicBaseUrl}/driver-applications/`);
  return value.startsWith(`${appUrl()}/driver-applications/`);
}
