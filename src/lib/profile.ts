export type EditableProfileFields = {
  name?: string;
  email?: string;
  supplierName?: string;
  preferredTheme?: "dark" | "light";
  preferredLocale?: string;
  currentPassword?: string;
  newPassword?: string;
  profileImageData?: string;
};

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

  if (input.preferredTheme === "dark" || input.preferredTheme === "light") {
    normalized.preferredTheme = input.preferredTheme;
  }

  if (typeof input.preferredLocale === "string") {
    const trimmed = input.preferredLocale.trim();
    if (trimmed && ["tr", "en", "de"].includes(trimmed)) {
      normalized.preferredLocale = trimmed;
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
