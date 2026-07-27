import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isGreeterRequired, validateAssignment, canTransition, stagesFor } from "../src/lib/booking/rules.ts";

describe("isGreeterRequired", () => {
  it("küçük araçta zorunlu", () => {
    assert.equal(isGreeterRequired("SMALL"), true);
  });
  it("büyük araçta zorunlu değil", () => {
    assert.equal(isGreeterRequired("LARGE"), false);
  });
});

describe("validateAssignment", () => {
  it("küçük araçta karşılamacı olmadan geçersiz", () => {
    const r = validateAssignment({ vehicleSize: "SMALL", driverFee: 500 });
    assert.equal(r.valid, false);
    assert.match(r.reason ?? "", /karşılamacı/i);
  });

  it("küçük araçta karşılamacı + ücretlerle geçerli", () => {
    const r = validateAssignment({ vehicleSize: "SMALL", greeterId: "g1", driverFee: 500, greeterFee: 200 });
    assert.equal(r.valid, true);
  });

  it("büyük araçta karşılamacı olmadan geçerli", () => {
    const r = validateAssignment({ vehicleSize: "LARGE", driverFee: 500 });
    assert.equal(r.valid, true);
  });

  it("şoför ücreti olmadan her zaman geçersiz", () => {
    const r = validateAssignment({ vehicleSize: "LARGE", driverFee: 0 });
    assert.equal(r.valid, false);
  });
});

describe("canTransition / stagesFor", () => {
  it("küçük araçta karşılamacı aşaması vardır", () => {
    assert.ok(stagesFor("SMALL").includes("GREETER_CONFIRMED"));
  });
  it("büyük araçta karşılamacı aşaması yoktur", () => {
    assert.ok(!stagesFor("LARGE").includes("GREETER_CONFIRMED"));
  });
  it("karşılamacı atanmış büyük araçta karşılamacı aşaması vardır", () => {
    assert.ok(stagesFor("LARGE", true).includes("GREETER_CONFIRMED"));
    assert.equal(canTransition("ASSIGNED", "GREETER_CONFIRMED", "LARGE", true), true);
    assert.equal(canTransition("GREETER_CONFIRMED", "EN_ROUTE", "LARGE", true), true);
  });
  it("PENDING_APPROVAL -> APPROVED geçerli", () => {
    assert.equal(canTransition("PENDING_APPROVAL", "APPROVED", "SMALL"), true);
  });
  it("PENDING_APPROVAL -> ASSIGNED geçersiz (adım atlanamaz)", () => {
    assert.equal(canTransition("PENDING_APPROVAL", "ASSIGNED", "SMALL"), false);
  });
  it("her durumdan CANCELLED'a geçilebilir", () => {
    assert.equal(canTransition("EN_ROUTE", "CANCELLED", "LARGE"), true);
  });
});
