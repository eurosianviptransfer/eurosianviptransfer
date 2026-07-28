import { describe, expect, it } from "vitest";
import { normalizePreferredLocale, normalizeProfileUpdate } from "../profile";

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

  it("normalizes bio text so it can be saved or cleared", () => {
    expect(normalizeProfileUpdate({ bio: "  Yeni bio  " })).toEqual({ bio: "Yeni bio" });
    expect(normalizeProfileUpdate({ bio: "   " })).toEqual({ bio: "" });
  });

  it("normalizes supported locales to the app locale set", () => {
    expect(normalizePreferredLocale("TR")).toBe("tr");
    expect(normalizePreferredLocale("en-US")).toBe("en");
    expect(normalizePreferredLocale("de")).toBe("de");
    expect(normalizePreferredLocale("fr")).toBe("tr");
  });
});
