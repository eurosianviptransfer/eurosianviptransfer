import { prisma } from "@/lib/db";
import { LOGO_SETTING_KEY } from "@/lib/cms/constants";

export const DEFAULT_LOGO_URL = "/eurosianviptransferlogo.png";

/**
 * Reads the site logo from the SiteSetting table (managed in /admin/settings).
 * Falls back to the default static logo file if no CMS value has been set,
 * or if the CMS/database is unreachable (never breaks the public site).
 */
export async function getSiteLogoUrl(): Promise<string> {
  try {
    const setting = await prisma.siteSetting.findFirst({ where: { key: LOGO_SETTING_KEY } });
    const url = (setting?.value as { url?: string } | null)?.url;
    return url || DEFAULT_LOGO_URL;
  } catch (err) {
    console.error("getSiteLogoUrl failed, using default logo:", err);
    return DEFAULT_LOGO_URL;
  }
}

/**
 * Reads a published ContentEntry for a given key + locale (managed in /admin/content).
 * Returns null if nothing is set, unpublished, or on any error — callers should
 * always keep their own hardcoded fallback copy for when this returns null.
 */
export async function getPageContent(key: string, locale: string) {
  try {
    const entry = await prisma.contentEntry.findUnique({ where: { key_locale: { key, locale } } });
    if (!entry || !entry.published) return null;
    return { title: entry.title, body: entry.body };
  } catch (err) {
    console.error(`getPageContent(${key}, ${locale}) failed:`, err);
    return null;
  }
}
