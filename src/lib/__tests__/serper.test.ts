import { afterEach, describe, expect, it, vi } from "vitest";
import { searchSerper } from "../providers/search/serper";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.SERPER_API_KEY;
});

describe("searchSerper", () => {
  it("env anahtarıyla arama isteği gönderir", async () => {
    process.env.SERPER_API_KEY = "test-key";

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ organic: [{ title: "Apple" }] }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await searchSerper({ q: "apple inc" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://google.serper.dev/search",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-API-KEY": "test-key",
          "Content-Type": "application/json",
        }),
      })
    );
    const request = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(request[1].body as string)).toEqual({
      q: "apple inc",
      gl: "tr",
      hl: "tr",
    });
    expect(result).toEqual({ organic: [{ title: "Apple" }] });
  });

  it("anahtar yoksa hata verir", async () => {
    await expect(searchSerper({ q: "apple inc" })).rejects.toThrow("SERPER_API_KEY eksik.");
  });
});
