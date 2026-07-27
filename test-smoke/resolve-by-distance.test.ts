import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolvePriceForKm, type PricingRuleLike } from "../src/lib/pricing/resolve-by-distance.ts";

const rules: PricingRuleLike[] = [
  { regionName: "Lara", km: 15, basePriceSmall: 25, basePriceLarge: 40 },
  { regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55 },
  { regionName: "Side", km: 66, basePriceSmall: 65, basePriceLarge: 80 },
  { regionName: "Alanya", km: 125, basePriceSmall: 110, basePriceLarge: 125 },
];

describe("resolvePriceForKm", () => {
  it("tolerans içindeki km'yi tam eşleşme sayar", () => {
    const r = resolvePriceForKm(36, rules, "SMALL", "Belek Otel X");
    assert.equal(r.isEstimate, false);
    assert.equal(r.regionName, "Belek");
    assert.equal(r.basePrice, 40);
  });

  it("iki bölge arası km'yi doğrusal interpolasyonla tahmin eder", () => {
    const r = resolvePriceForKm(25, rules, "SMALL", "Yeni Otel Y");
    assert.equal(r.isEstimate, true);
    assert.equal(r.basePrice, 32.5);
  });

  it("en uzak bölgeden daha uzak mesafede oranı uzatır", () => {
    const last = rules[rules.length - 1];
    const perKm = last.basePriceSmall / last.km;
    const r = resolvePriceForKm(150, rules, "SMALL", "Gazipaşa civarı");
    assert.equal(r.isEstimate, true);
    assert.ok(Math.abs(r.basePrice - perKm * 150) < 0.5);
  });

  it("en yakın bölgeden daha yakın mesafede en düşük bölgeyi kullanır", () => {
    const r = resolvePriceForKm(8, rules, "SMALL", "Havalimanı yakın otel");
    assert.equal(r.isEstimate, true);
    assert.equal(r.basePrice, 25);
  });

  it("boş tablo hata fırlatır", () => {
    assert.throws(() => resolvePriceForKm(30, [], "SMALL", "X"));
  });
});
