export function inferRegionName(text: string, regionNames: string[]): string | null {
  const haystack = normalize(text);
  const candidates = [...regionNames].sort((a, b) => b.length - a.length);

  for (const regionName of candidates) {
    const needle = normalize(regionName);
    if (needle && haystack.includes(needle)) {
      return regionName;
    }
  }

  return null;
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[^a-z0-9çğıöşü\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
