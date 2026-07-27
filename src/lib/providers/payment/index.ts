import type { PaymentProvider } from "./types";
import { StripePaymentProvider } from "./stripe-provider";
import { AirtmPaymentProvider } from "./airtm-provider";

export type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "./types";

/**
 * Admin panelinden hangi ödeme sağlayıcılarının açık olduğu yönetilir
 * (Bölüm 1 ve 9). Bu factory, o ayara göre doğru adapter'ı döner.
 */
export function getPaymentProvider(name: "stripe" | "airtm" = "stripe"): PaymentProvider {
  switch (name) {
    case "stripe":
      return new StripePaymentProvider();
    case "airtm":
      return new AirtmPaymentProvider();
    default:
      throw new Error(`Bilinmeyen ödeme sağlayıcısı: ${name}`);
  }
}
