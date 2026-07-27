import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!accountId || !bucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !publicBaseUrl) throw new Error("R2 depolama yapılandırması eksik: R2_PUBLIC_BASE_URL dahil tüm R2 değişkenlerini tanımlayın.");
  return { accountId, bucket, publicBaseUrl };
}

function client() {
  const { accountId } = config();
  return new S3Client({ region: "auto", endpoint: `https://${accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } });
}

export async function createVehicleImageUpload(contentType: string, extension: string) {
  const { bucket, publicBaseUrl } = config();
  const key = `driver-applications/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const uploadUrl = await getSignedUrl(client(), new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), { expiresIn: 600 });
  return { uploadUrl, publicUrl: `${publicBaseUrl}/${key}` };
}

export function isAllowedVehicleImageUrl(value: string) {
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  return Boolean(publicBaseUrl && value.startsWith(`${publicBaseUrl}/driver-applications/`));
}
