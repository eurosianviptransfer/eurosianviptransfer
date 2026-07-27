import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateOtp, verifyOtp, normalizePhone } from "../src/lib/auth/otp.ts";

describe("generateOtp", () => {
  it("6 haneli sayısal kod üretir", () => {
    const rec = generateOtp("+905551112233");
    assert.match(rec.code, /^\d{6}$/);
    assert.equal(rec.attempts, 0);
  });
});

describe("verifyOtp", () => {
  const now = Date.now();
  const rec = generateOtp("+905551112233", now);

  it("doğru kod ve süre içinde ok:true döner", () => {
    assert.deepEqual(verifyOtp(rec, rec.code, now + 1000), { ok: true });
  });

  it("yanlış kod mismatch döner", () => {
    const wrong = rec.code === "000000" ? "111111" : "000000";
    assert.deepEqual(verifyOtp(rec, wrong, now + 1000), { ok: false, reason: "mismatch" });
  });

  it("süresi dolmuş OTP expired döner", () => {
    assert.deepEqual(verifyOtp(rec, rec.code, now + 6 * 60 * 1000), { ok: false, reason: "expired" });
  });

  it("çok fazla deneme sonrası too_many_attempts döner", () => {
    const maxedOut = { ...rec, attempts: 5 };
    assert.deepEqual(verifyOtp(maxedOut, rec.code, now + 1000), { ok: false, reason: "too_many_attempts" });
  });
});

describe("normalizePhone", () => {
  it("0 ile başlayan numarayı +90'a çevirir", () => {
    assert.equal(normalizePhone("0555 111 22 33"), "+905551112233");
  });
  it("zaten + ile başlıyorsa dokunmaz", () => {
    assert.equal(normalizePhone("+905551112233"), "+905551112233");
  });
  it("90 ile başlıyorsa + ekler", () => {
    assert.equal(normalizePhone("905551112233"), "+905551112233");
  });
});
