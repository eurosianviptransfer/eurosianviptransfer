import { describe, it, expect } from "vitest";
import { resolvePriceForKm, type PricingRuleLike } from "../pricing/resolve-by-distance";

const rules: PricingRuleLike[] = [
  { regionName: "Lara", km: 15, basePriceSmall: 25, basePriceLarge: 40 },
  { regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55 },
  { regionName: "Side", km: 66, basePriceSmall: 65, basePriceLarge: 80 },
  { regionName: "Alanya", km: 125, basePriceSmall: 110, basePriceLarge: 125 },
];

describe("resolvePriceForKm", () => {
  it("tolerans içindeki km'yi tam eşleşme sayar", () => {
    const r = resolvePriceForKm(36, rules, "SMALL", "Belek Otel X");
    expect(r.isEstimate).toBe(false);
    expect(r.regionName).toBe("Belek");
    expect(r.basePrice).toBe(40);
  });

  it("iki bölge arası km'yi doğrusal interpolasyonla tahmin eder", () => {
    // 15 (25₺) ile 35 (40₺) arası, 25 km -> ratio 0.5 -> 32.5₺
    const r = resolvePriceForKm(25, rules, "SMALL", "Yeni Otel Y");
    expect(r.isEstimate).toBe(true);
    expect(r.basePrice).toBe(32.5);
  });

  it("tablodaki en uzak bölgeden daha uzak mesafede oranı uzatır", () => {
    const last = rules[rules.length - 1]; // Alanya 125km / 110₺
    const perKm = last.basePriceSmall / last.km;
    const r = resolvePriceForKm(150, rules, "SMALL", "Gazipaşa civarı");
    expect(r.isEstimate).toBe(true);
    expect(r.basePrice).toBeCloseTo(perKm * 150, 1);
  });

  it("en yakın bölgeden daha yakın mesafede en düşük bölgeyi kullanır", () => {
    const r = resolvePriceForKm(8, rules, "SMALL", "Havalimanı yakın otel");
    expect(r.isEstimate).toBe(true);
    expect(r.basePrice).toBe(25); // Lara'nın fiyatı
  });

  it("boş tablo hata fırlatır", () => {
    expect(() => resolvePriceForKm(30, [], "SMALL", "X")).toThrow();
  });
});
