import { describe, expect, it } from "vitest";
import { getAdminCopy } from "@/lib/admin-copy";

describe("getAdminCopy", () => {
  it("returns Turkish copy for Turkish locale", () => {
    const copy = getAdminCopy("tr");
    expect(copy.title).toContain("Admin");
    expect(copy.summary.live).toBe("Canlı");
  });

  it("falls back to English for unsupported locales", () => {
    const copy = getAdminCopy("zz");
    expect(copy.title).toContain("Admin");
    expect(copy.summary.pending).toBe("Pending approval");
  });
});
