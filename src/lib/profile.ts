export type EditableProfileFields = {
  name?: string;
  email?: string;
  supplierName?: string;
  bio?: string;
  preferredTheme?: "dark" | "light";
  preferredLocale?: string;
  currentPassword?: string;
  newPassword?: string;
  profileImageData?: string;
};

const supportedLocales = ["tr", "en", "de", "ru"] as const;

export function normalizePreferredLocale(value: string | null | undefined): string {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return "tr";

  if ((supportedLocales as readonly string[]).includes(trimmed)) return trimmed;

  const base = trimmed.split("-")[0];
  if ((supportedLocales as readonly string[]).includes(base)) return base;

  if (base.startsWith("de")) return "de";
  if (base.startsWith("en")) return "en";
  if (base.startsWith("ru")) return "ru";
  if (base.startsWith("tr")) return "tr";

  return "tr";
}

export function normalizeProfileUpdate(input: Record<string, unknown>): Partial<EditableProfileFields> {
  const normalized: Partial<EditableProfileFields> = {};

  if (typeof input.name === "string") {
    const trimmed = input.name.trim();
    if (trimmed) normalized.name = trimmed;
  }

  if (typeof input.email === "string") {
    const trimmed = input.email.trim().toLowerCase();
    if (trimmed) normalized.email = trimmed;
  }

  if (typeof input.supplierName === "string") {
    const trimmed = input.supplierName.trim();
    if (trimmed) normalized.supplierName = trimmed;
  }

  if (typeof input.bio === "string") {
    normalized.bio = input.bio.trim();
  }

  if (input.preferredTheme === "dark" || input.preferredTheme === "light") {
    normalized.preferredTheme = input.preferredTheme;
  }

  if (typeof input.preferredLocale === "string") {
    const trimmedLocale = input.preferredLocale.trim().toLowerCase();
    const normalizedLocale = normalizePreferredLocale(trimmedLocale);
    if (normalizedLocale !== "tr" || trimmedLocale === "tr") {
      normalized.preferredLocale = normalizedLocale;
    }
  }

  if (typeof input.currentPassword === "string" && input.currentPassword.trim()) {
    normalized.currentPassword = input.currentPassword;
  }

  if (typeof input.newPassword === "string" && input.newPassword.trim()) {
    normalized.newPassword = input.newPassword;
  }

  if (typeof input.profileImageData === "string" && input.profileImageData.trim()) {
    normalized.profileImageData = input.profileImageData.trim();
  }

  return normalized;
}
