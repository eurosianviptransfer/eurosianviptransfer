import { describe, expect, it } from "vitest";
import { bookingRequestSchema, quoteRequestSchema } from "../booking/quote";

describe("quoteRequestSchema", () => {
  it("geçerli bir fiyat isteğini parse eder", () => {
    const parsed = quoteRequestSchema.parse({
      destinationLat: "36.9",
      destinationLng: "30.8",
      destinationLabel: "Lara",
      vehicleSize: "SMALL",
    });

    expect(parsed.destinationLat).toBe(36.9);
    expect(parsed.hasReturnLeg).toBe(false);
  });
});

describe("bookingRequestSchema", () => {
  it("geçmiş transfer zamanını reddeder", () => {
    expect(() => bookingRequestSchema.parse({
      guestName: "Ayse Yilmaz",
      guestPhone: "0500 000 00 00",
      destinationText: "Lara Hotel",
      destinationLat: 36.9,
      destinationLng: 30.8,
      scheduledAt: "2020-01-01T12:00:00.000Z",
      passengers: 2,
      vehicleSize: "LARGE",
      paymentMethod: "PAY_IN_VEHICLE",
    })).toThrow("Transfer zamanı gelecekte olmalı.");
  });

  it("isteği normalleştirir ve opsiyonelleri temizler", () => {
    const parsed = bookingRequestSchema.parse({
      guestName: "   Ayse Yilmaz  ",
      guestPhone: " 0500 000 00 00 ",
      guestEmail: "",
      guestLanguage: " TR ",
      destinationText: "  Lara Hotel  ",
      destinationLat: "36.9",
      destinationLng: "30.8",
      scheduledAt: "2027-07-25T12:00:00.000Z",
      passengers: "2",
      luggage: "1",
      vehicleSize: "LARGE",
      needsChildSeat: false,
      needsWheelchair: false,
      hasReturnLeg: false,
      paymentMethod: "PAY_IN_VEHICLE",
    });

    expect(parsed.guestName).toBe("Ayse Yilmaz");
    expect(parsed.guestEmail).toBeUndefined();
    expect(parsed.guestLanguage).toBe("TR");
    expect(parsed.destinationText).toBe("Lara Hotel");
    expect(parsed.passengers).toBe(2);
    expect(parsed.luggage).toBe(1);
  });
});
