import { describe, it, expect } from "vitest";
import { quotePrice, calculateWaitingFee } from "../pricing/engine";

const belek = { regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55 };

describe("quotePrice", () => {
  it("küçük araç, tek yön, indirimsiz", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "SMALL", hasReturnLeg: false });
    expect(q.total).toBe(40);
    expect(q.returnLegPrice).toBe(0);
  });

  it("büyük araç, dönüş dahil", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "LARGE", hasReturnLeg: true });
    expect(q.basePrice).toBe(55);
    expect(q.returnLegPrice).toBe(55);
    expect(q.total).toBe(110);
  });

  it("promosyon kodu indirimi uygulanır", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "SMALL", hasReturnLeg: false, promoDiscountPercent: 10 });
    expect(q.discount).toBe(4);
    expect(q.total).toBe(36);
  });

  it("indirim yüzdesi 0-100 aralığına sıkıştırılır", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "SMALL", hasReturnLeg: false, promoDiscountPercent: 250 });
    expect(q.total).toBe(0);
  });
});

describe("calculateWaitingFee", () => {
  it("ücretsiz süre aşılmadıysa ücret 0", () => {
    expect(calculateWaitingFee({ waitedMinutes: 45, freeMinutes: 60, perMinuteFee: 1 })).toBe(0);
  });

  it("aşım dakika başı ücretlendirilir", () => {
    expect(calculateWaitingFee({ waitedMinutes: 90, freeMinutes: 60, perMinuteFee: 1.5 })).toBe(45);
  });
});
