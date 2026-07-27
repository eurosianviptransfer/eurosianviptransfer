import Stripe from "stripe";
import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider } from "./types";

export class StripePaymentProvider implements PaymentProvider {
  readonly name = "stripe";
  private stripe: Stripe;

  constructor(secretKey: string = process.env.STRIPE_SECRET_KEY ?? "") {
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY tanımlı değil (.env kontrol et).");
    this.stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    if (!process.env.APP_URL) throw new Error("APP_URL tanımlı değil.");
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: Math.round(input.amount * 100),
            product_data: { name: `Havalimanı Transferi — ${input.bookingId}` },
          },
          quantity: 1,
        },
      ],
      customer_email: input.guestEmail ?? undefined,
      metadata: { bookingId: input.bookingId },
      success_url: `${process.env.APP_URL}/takip/${input.bookingId}?payment=success`,
      cancel_url: `${process.env.APP_URL}/takip/${input.bookingId}?payment=cancelled`,
    });

    return {
      checkoutUrl: session.url ?? undefined,
      providerReference: session.id,
      status: "PENDING",
    };
  }

  async getPaymentStatus(providerReference: string): Promise<"PENDING" | "PAID" | "FAILED"> {
    const session = await this.stripe.checkout.sessions.retrieve(providerReference);
    if (session.payment_status === "paid") return "PAID";
    if (session.status === "expired") return "FAILED";
    return "PENDING";
  }
}
