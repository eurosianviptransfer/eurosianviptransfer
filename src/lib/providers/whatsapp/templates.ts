/** Meta WhatsApp Manager'da onaylanan şablonların uygulama registry'si. */
export type SupportedLang = "TR" | "EN" | "DE" | "RU";

export interface ApprovedTemplate {
  metaTemplateName: string;
  /** Meta'daki {{1}}, {{2}} sırası. */
  variableOrder: string[];
}

const template = (key: string, variableOrder: string[]): ApprovedTemplate => ({
  metaTemplateName: process.env[`WHATSAPP_TEMPLATE_${key.toUpperCase()}`] ?? `${key}_v1`,
  variableOrder,
});

const templatesForLanguage = (): Record<string, ApprovedTemplate> => ({
  booking_assigned: template("booking_assigned", ["code", "driverName", "plate"]),
  payout_recorded: template("payout_recorded", ["amount", "code"]),
  otp_code: template("otp_code", ["code"]),
  guest_notification: template("guest_notification", ["text"]),
  personnel_credentials: template("personnel_credentials", ["name", "loginUrl", "phone", "password"]),
});

export const APPROVED_TEMPLATES: Record<SupportedLang, Record<string, ApprovedTemplate>> = {
  TR: templatesForLanguage(), EN: templatesForLanguage(), DE: templatesForLanguage(), RU: templatesForLanguage(),
};

export function getApprovedTemplate(lang: SupportedLang, key: string): ApprovedTemplate | undefined {
  const registered = APPROVED_TEMPLATES[lang]?.[key];
  if (!registered) return undefined;
  return {
    ...registered,
    metaTemplateName: process.env[`WHATSAPP_TEMPLATE_${key.toUpperCase()}`] ?? registered.metaTemplateName,
  };
}

export function normalizeWhatsAppLanguage(lang?: string): SupportedLang {
  const normalized = (lang ?? "TR").toUpperCase();
  return ["TR", "EN", "DE", "RU"].includes(normalized) ? normalized as SupportedLang : "TR";
}

export function getMetaLanguageCode(lang?: string): string {
  const configured = process.env.WHATSAPP_TEMPLATE_LANGUAGE_CODE;
  if (configured) return configured;
  return normalizeWhatsAppLanguage(lang).toLowerCase();
}
