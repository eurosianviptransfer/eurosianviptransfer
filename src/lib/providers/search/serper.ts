export interface SerperSearchOptions {
  q: string;
  gl?: string;
  hl?: string;
}

export async function searchSerper(options: SerperSearchOptions) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error("SERPER_API_KEY eksik.");
  }

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: options.q,
      gl: options.gl ?? "tr",
      hl: options.hl ?? "tr",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Serper arama başarısız: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }

  return res.json();
}
