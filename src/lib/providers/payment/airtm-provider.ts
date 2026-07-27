import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider } from "./types";

const DEFAULT_BASE_URL = "https://api.enterprise.airtm.com";
const PAID_STATUSES = new Set(["CONFIRMED"]);
const FAILED_STATUSES = new Set(["CANCELED", "FAILED", "BRIDGE_FAILED", "BRIDGE_CANCELED"]);

/** Airtm Enterprise API v2 pay-in adapter. Airtm API tutarları USD/USDC'dir. */
export class AirtmPaymentProvider implements PaymentProvider {
  readonly name = "airtm";
  private readonly baseUrl: string;
  private readonly checkoutUrlTemplate: string;

  constructor(baseUrl = process.env.AIRTM_API_BASE_URL ?? DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.checkoutUrlTemplate = process.env.AIRTM_CHECKOUT_URL_TEMPLATE ?? "";
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const credentials = getCredentials();
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("Airtm tutarı sıfırdan büyük olmalı.");
    if (!["USD", "USDC"].includes(input.currency.toUpperCase())) {
      throw new Error("Airtm ödemeleri USD/USDC olmalı; kur dönüşümü ayrıca uygulanmalı.");
    }
    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("APP_URL tanımlı değil.");
    if (!this.checkoutUrlTemplate) throw new Error("AIRTM_CHECKOUT_URL_TEMPLATE tanımlı değil.");

    const payin = await this.request("/v2/payins", credentials, {
      method: "POST",
      body: JSON.stringify({
        code: `booking-${input.bookingId}`,
        description: `Eurosian VIP Transfer — ${input.bookingId}`,
        items: [{ description: `Transfer ${input.bookingId}`, amount: roundMoney(input.amount), quantity: 1 }],
        confirmationUri: `${appUrl}/takip/${encodeURIComponent(input.bookingId)}?payment=confirmed`,
        cancelUri: `${appUrl}/takip/${encodeURIComponent(input.bookingId)}?payment=cancelled`,
      }),
    }) as AirtmPayin;
    if (!payin.id) throw new Error("Airtm pay-in yanıtında id yok.");

    return {
      checkoutUrl: this.checkoutUrlTemplate.replace("{id}", encodeURIComponent(payin.id)),
      providerReference: payin.id,
      status: "PENDING",
    };
  }

  async getPaymentStatus(providerReference: string): Promise<"PENDING" | "PAID" | "FAILED"> {
    const payin = await this.request(`/v2/payins/${encodeURIComponent(providerReference)}`, getCredentials()) as AirtmPayin;
    const status = String(payin.status ?? "").toUpperCase();
    if (PAID_STATUSES.has(status)) return "PAID";
    if (FAILED_STATUSES.has(status)) return "FAILED";
    return "PENDING";
  }

  private async request(path: string, credentials: Credentials, init: RequestInit = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Basic ${Buffer.from(`${credentials.key}:${credentials.secret}`).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    if (!res.ok) throw new Error(`Airtm API ${res.status}: ${(await res.text()).slice(0, 500)}`);
    return await res.json() as Record<string, unknown>;
  }
}

interface Credentials { key: string; secret: string }
interface AirtmPayin { id?: string; status?: string }

function getCredentials(): Credentials {
  const key = process.env.AIRTM_API_KEY ?? process.env.AIRTM_CLIENT_KEY;
  const secret = process.env.AIRTM_API_SECRET ?? process.env.AIRTM_CLIENT_SECRET;
  if (!key || !secret) throw new Error("AIRTM_API_KEY/AIRTM_API_SECRET tanımlı değil.");
  return { key, secret };
}

function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
