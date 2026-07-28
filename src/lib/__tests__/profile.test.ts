import { describe, expect, it } from "vitest";
import { normalizeProfileUpdate } from "../profile";

describe("normalizeProfileUpdate", () => {
  it("sanitizes editable profile fields and password change", () => {
    const value = normalizeProfileUpdate({
      name: "  Ali Yılmaz  ",
      email: "  ali@example.com  ",
      supplierName: "  VIP Atlas  ",
      preferredTheme: "light",
      preferredLocale: "tr",
      currentPassword: "old-pass",
      newPassword: "new-pass-123",
    });

    expect(value).toEqual({
      name: "Ali Yılmaz",
      email: "ali@example.com",
      supplierName: "VIP Atlas",
      preferredTheme: "light",
      preferredLocale: "tr",
      currentPassword: "old-pass",
      newPassword: "new-pass-123",
    });
  });

  it("drops unsupported values", () => {
    const value = normalizeProfileUpdate({
      name: "",
      email: "   ",
      preferredTheme: "blue",
      preferredLocale: "fr",
      profileImageData: "data:image/png;base64,abc",
    });

    expect(value).toEqual({
      profileImageData: "data:image/png;base64,abc",
    });
  });
});
