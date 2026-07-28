import { afterEach, describe, expect, it, vi } from "vitest";
import { getPreferredTheme, setTheme } from "../theme";

describe("admin theme helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the stored light theme when available", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: vi.fn().mockReturnValue("light"),
        setItem: vi.fn(),
      },
    });

    expect(getPreferredTheme()).toBe("light");
  });

  it("applies and persists the selected theme", () => {
    const localStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    };
    const documentElement: { dataset: Record<string, string>; style: Record<string, string> } = {
      dataset: {},
      style: {},
    };

    vi.stubGlobal("window", { localStorage });
    vi.stubGlobal("document", { documentElement });

    expect(setTheme("light")).toBe("light");
    expect(localStorage.setItem).toHaveBeenCalledWith("admin-theme", "light");
    expect(documentElement.dataset.theme).toBe("light");
    expect(documentElement.style.colorScheme).toBe("light");
  });
});
