/**
 * PaymentProvider — sağlayıcıdan bağımsız arayüz.
 * Stripe, Airtm ve (Faz 3) iyzico bu arayüze göre yazılır; iş mantığı kodu
 * hangi sağlayıcı kullanıldığını bilmez. Bkz. Bölüm 1 ve 9, Talimat Bölüm 16.
 */
export interface CreatePaymentInput {
  bookingId: string;
  amount: number;
  currency: string;
  guestEmail?: string | null;
}

export interface CreatePaymentResult {
  /** Misafirin ödemeyi tamamlaması için yönlendirileceği/gösterileceği referans. */
  checkoutUrl?: string;
  providerReference: string;
  status: "PENDING" | "PAID" | "FAILED";
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  /** Webhook/polling sonucu durumu senkronize etmek için. */
  getPaymentStatus(providerReference: string): Promise<"PENDING" | "PAID" | "FAILED">;
}
