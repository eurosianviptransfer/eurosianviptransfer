/**
 * SIFIR NPM BAĞIMLILIĞI test dosyası — Node.js'in kendi built-in test runner'ını
 * (node:test) ve type-stripping özelliğini (Node 22.6+) kullanır. `npm install`
 * gerektirmez, gerçek src/ kaynak dosyalarını doğrudan import eder.
 *
 * Çalıştırma: npm run test:smoke
 *         ya da: node --experimental-strip-types --test test-smoke/*.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { quotePrice, calculateWaitingFee } from "../src/lib/pricing/engine.ts";

const belek = { regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55 };

describe("quotePrice", () => {
  it("küçük araç, tek yön, indirimsiz", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "SMALL", hasReturnLeg: false });
    assert.equal(q.total, 40);
    assert.equal(q.returnLegPrice, 0);
  });

  it("büyük araç, dönüş dahil", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "LARGE", hasReturnLeg: true });
    assert.equal(q.basePrice, 55);
    assert.equal(q.returnLegPrice, 55);
    assert.equal(q.total, 110);
  });

  it("promosyon kodu indirimi uygulanır", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "SMALL", hasReturnLeg: false, promoDiscountPercent: 10 });
    assert.equal(q.discount, 4);
    assert.equal(q.total, 36);
  });

  it("indirim yüzdesi 0-100 aralığına sıkıştırılır", () => {
    const q = quotePrice({ rule: belek, vehicleSize: "SMALL", hasReturnLeg: false, promoDiscountPercent: 250 });
    assert.equal(q.total, 0);
  });
});

describe("calculateWaitingFee", () => {
  it("ücretsiz süre aşılmadıysa ücret 0", () => {
    assert.equal(calculateWaitingFee({ waitedMinutes: 45, freeMinutes: 60, perMinuteFee: 1 }), 0);
  });

  it("aşım dakika başı ücretlendirilir", () => {
    assert.equal(calculateWaitingFee({ waitedMinutes: 90, freeMinutes: 60, perMinuteFee: 1.5 }), 45);
  });
});
