import { getApprovedTemplate, getMetaLanguageCode, normalizeWhatsAppLanguage } from "./templates";

/**
 * WhatsAppProvider — Faz 1'de Twilio (hızlı kurulum), Faz 3'te Meta Cloud API'ye
 * geçiş (Bölüm 1, 14). İş mantığı kodu sadece bu arayüzü çağırır.
 */
export interface WhatsAppMessage {
  toPhone: string;
  templateName: string;
  variables: Record<string, string>;
  language?: string;
}

export interface WhatsAppProvider {
  readonly name: string;
  sendTemplateMessage(msg: WhatsAppMessage): Promise<{ providerMessageId: string }>;
}

class TwilioWhatsAppProvider implements WhatsAppProvider {
  readonly name = "twilio";

  async sendTemplateMessage(msg: WhatsAppMessage): Promise<{ providerMessageId: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // örn. whatsapp:+14155238886
    if (!accountSid || !authToken || !fromNumber) {
      throw new Error("Twilio ortam değişkenleri eksik (.env.example'a bak).");
    }

    const body = renderTemplate(msg.templateName, msg.variables);
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: `whatsapp:${msg.toPhone}`,
        Body: body,
      }),
    });
    const data = await res.json();
    return { providerMessageId: data.sid };
  }
}

class MetaWhatsAppProvider implements WhatsAppProvider {
  readonly name = "meta";

  async sendTemplateMessage(msg: WhatsAppMessage): Promise<{ providerMessageId: string }> {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneNumberId) {
      throw new Error("Meta WhatsApp Cloud API ortam değişkenleri eksik.");
    }

    const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION ?? "v20.0";
    const res = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: msg.toPhone,
        type: "template",
        template: getMetaTemplatePayload(msg),
      }),
    });
    if (!res.ok) throw new Error(`Meta WhatsApp API ${res.status}: ${(await res.text()).slice(0, 500)}`);
    const data = await res.json() as { messages?: Array<{ id?: string }> };
    const providerMessageId = data.messages?.[0]?.id;
    if (!providerMessageId) throw new Error("Meta WhatsApp API mesaj kimliği döndürmedi.");
    return { providerMessageId };
  }
}

function renderTemplate(templateName: string, vars: Record<string, string>): string {
  // Basit MVP: şablon adına göre sabit metinlerden birini üret.
  const templates: Record<string, string> = {
    booking_assigned: `Rezervasyonunuz ${vars.code} atandı. Şoför: ${vars.driverName}, Plaka: ${vars.plate}.`,
    payout_recorded: `Hakedişiniz kaydedildi: ₺${vars.amount} (${vars.code}).`,
    otp_code: `Eurosian VIP Transfer giriş kodunuz: ${vars.code} (5 dakika geçerlidir).`,
    guest_notification_freeform: vars.text, // zaten hedef dile çevrilmiş, direkt gönderilir
  };
  return templates[templateName] ?? JSON.stringify(vars);
}

export function getWhatsAppProvider(name: "twilio" | "meta" = (process.env.WHATSAPP_PROVIDER as "twilio" | "meta") ?? "twilio"): WhatsAppProvider {
  return name === "meta" ? new MetaWhatsAppProvider() : new TwilioWhatsAppProvider();
}

function getMetaTemplatePayload(msg: WhatsAppMessage) {
  const lang = normalizeWhatsAppLanguage(msg.language);
  const approved = getApprovedTemplate(lang, msg.templateName);
  if (!approved) throw new Error(`Meta WhatsApp şablonu kayıtlı değil: ${lang}/${msg.templateName}`);
  const parameters = approved.variableOrder.map((key) => {
    const value = msg.variables[key];
    if (value === undefined) throw new Error(`WhatsApp şablon değişkeni eksik: ${key}`);
    return { type: "text", text: value };
  });
  return {
    name: approved.metaTemplateName,
    language: { code: getMetaLanguageCode(lang) },
    components: [{ type: "body", parameters }],
  };
}
