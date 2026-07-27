import { afterEach, describe, expect, it, vi } from "vitest";
import { AirtmPaymentProvider } from "../providers/payment/airtm-provider";
import { getWhatsAppProvider } from "../providers/whatsapp";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("AirtmPaymentProvider", () => {
  it("USD pay-in oluşturur ve checkout URL döndürür", async () => {
    vi.stubEnv("AIRTM_API_KEY", "test-key");
    vi.stubEnv("AIRTM_API_SECRET", "test-secret");
    vi.stubEnv("AIRTM_CHECKOUT_URL_TEMPLATE", "https://checkout.test/payin/{id}");
    vi.stubEnv("APP_URL", "https://eurosian.test");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "payin-123", status: "CREATED" }), { status: 200 }),
    );

    const result = await new AirtmPaymentProvider("https://airtm.test").createPayment({
      bookingId: "booking-1",
      amount: 120.5,
      currency: "USD",
    });

    expect(result).toEqual({
      checkoutUrl: "https://checkout.test/payin/payin-123",
      providerReference: "payin-123",
      status: "PENDING",
    });
    expect(fetchMock).toHaveBeenCalledWith("https://airtm.test/v2/payins", expect.objectContaining({ method: "POST" }));
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect((request.headers as Record<string, string>).Authorization).toBe(`Basic ${Buffer.from("test-key:test-secret").toString("base64")}`);
    expect(JSON.parse(String(request.body))).toMatchObject({ code: "booking-booking-1", items: [{ amount: 120.5 }] });
  });

  it("EUR tutarı kur dönüşümü olmadan reddeder", async () => {
    vi.stubEnv("AIRTM_API_KEY", "test-key");
    vi.stubEnv("AIRTM_API_SECRET", "test-secret");
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(new AirtmPaymentProvider().createPayment({
      bookingId: "booking-1", amount: 100, currency: "EUR",
    })).rejects.toThrow("USD/USDC");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("CONFIRMED durumunu PAID olarak eşler", async () => {
    vi.stubEnv("AIRTM_API_KEY", "test-key");
    vi.stubEnv("AIRTM_API_SECRET", "test-secret");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "payin-123", status: "CONFIRMED" }), { status: 200 }),
    );

    await expect(new AirtmPaymentProvider().getPaymentStatus("payin-123")).resolves.toBe("PAID");
  });
});

describe("Meta WhatsApp provider", () => {
  it("registry sırasına göre onaylı template payload gönderir", async () => {
    vi.stubEnv("WHATSAPP_TOKEN", "meta-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "phone-1");
    vi.stubEnv("WHATSAPP_TEMPLATE_BOOKING_ASSIGNED", "booking_assigned_tr");
    vi.stubEnv("WHATSAPP_TEMPLATE_LANGUAGE_CODE", "tr");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ messages: [{ id: "wamid-1" }] }), { status: 200 }),
    );

    const result = await getWhatsAppProvider("meta").sendTemplateMessage({
      toPhone: "+905551112233",
      templateName: "booking_assigned",
      language: "TR",
      variables: { plate: "07 ABC 123", driverName: "Ali", code: "EV-1" },
    });

    expect(result.providerMessageId).toBe("wamid-1");
    const request = vi.mocked(globalThis.fetch).mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(request.body));
    expect(body.template).toEqual({
      name: "booking_assigned_tr",
      language: { code: "tr" },
      components: [{ type: "body", parameters: [
        { type: "text", text: "EV-1" },
        { type: "text", text: "Ali" },
        { type: "text", text: "07 ABC 123" },
      ]}],
    });
  });
});
