import { describe, expect, it } from "vitest";
import { normalizeBookingForAdmin } from "./admin-data";

describe("normalizeBookingForAdmin", () => {
  it("maps booking data to admin UI shape", () => {
    const booking = {
      id: "bk_123",
      code: "EVT-1001",
      guestName: "Ada Yılmaz",
      guestPhone: "+90 532 111 2233",
      guestEmail: "ada@example.com",
      originAirport: "AYT",
      destinationText: "Maxx Royal Belek",
      scheduledAt: "2026-08-07T14:30:00.000Z",
      passengers: 3,
      luggage: 2,
      price: 180,
      currency: "EUR",
      paymentStatus: "PAID",
      status: "APPROVED",
      vehicleSize: "SMALL",
    };

    const result = normalizeBookingForAdmin(booking as any);

    expect(result.pnrCode).toBe("EVT-1001");
    expect(result.customerName).toBe("Ada Yılmaz");
    expect(result.amount).toBe("€180");
    expect(result.paymentStatus).toBe("PAID");
    expect(result.status).toBe("CONFIRMED");
    expect(result.vehicleType).toContain("Vito");
  });
});
