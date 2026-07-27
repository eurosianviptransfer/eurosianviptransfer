export function getAppUrl() {
  const raw = process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
