/**
 * TranslationProvider — birincil Google Cloud Translation v3, opsiyonel
 * ikinci katman DeepL (ana diller için kalite artırımı). Bölüm 1.
 */
export interface TranslationProvider {
  readonly name: string;
  translate(text: string, targetLang: string, sourceLang?: string): Promise<string>;
}

class GoogleTranslateProvider implements TranslationProvider {
  readonly name = "google";

  async translate(text: string, targetLang: string, sourceLang = "tr"): Promise<string> {
    const apiKey = process.env.TRANSLATE_API_KEY;
    if (!apiKey) throw new Error("TRANSLATE_API_KEY eksik.");

    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: "text" }),
    });
    const data = await res.json();
    return data.data?.translations?.[0]?.translatedText ?? text;
  }
}

class DeepLTranslateProvider implements TranslationProvider {
  readonly name = "deepl";

  async translate(text: string, targetLang: string, sourceLang = "TR"): Promise<string> {
    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) throw new Error("DEEPL_API_KEY eksik.");

    const res = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text, source_lang: sourceLang, target_lang: targetLang }),
    });
    const data = await res.json();
    return data.translations?.[0]?.text ?? text;
  }
}

// Ana diller (TR/EN/DE/RU) için kalite gerekiyorsa DeepL, diğerleri için Google.
const HIGH_QUALITY_LANGS = new Set(["EN", "DE", "RU", "TR"]);

export function getTranslationProvider(targetLang: string): TranslationProvider {
  return HIGH_QUALITY_LANGS.has(targetLang.toUpperCase())
    ? new DeepLTranslateProvider()
    : new GoogleTranslateProvider();
}
