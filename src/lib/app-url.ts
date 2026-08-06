export function getAppUrl() {
  if (process.env.APP_URL) {
    const raw = process.env.APP_URL;
    return raw.endsWith("/") ? raw.slice(0, -1) : raw;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const raw = process.env.NEXTAUTH_URL || "https://eurosian-vip-transfer.vercel.app";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
