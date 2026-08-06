import crypto from "crypto";

export function getCloudinaryConfig() {
  // Prefer explicit vars, fallback to CLOUDINARY_URL
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;
  const url = process.env.CLOUDINARY_URL;
  if ((!cloudName || !apiKey || !apiSecret) && url) {
    // parse cloudinary://key:secret@cloudname
    try {
      const m = url.match(/^cloudinary:\/\/(?<key>[^:]+):(?<secret>[^@]+)@(?<cloud>.+)$/);
      if (m && m.groups) {
        apiKey = apiKey ?? m.groups.key;
        apiSecret = apiSecret ?? m.groups.secret;
        cloudName = cloudName ?? m.groups.cloud;
      }
    } catch (e) {
      // ignore parse errors; caller must validate
    }
  }
  return { cloudName, apiKey, apiSecret };
}

export function signPayload(params: Record<string, any>, apiSecret: string) {
  // Cloudinary signing: sort params by key, build "key=value" joined by '&', then append apiSecret and sha1
  const keys = Object.keys(params).filter(k => params[k] !== undefined && params[k] !== null);
  keys.sort();
  const toSign = keys.map(k => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/**
 * Verilen resim/görsel yolunu Cloudinary CDN URL'sine dönüştürür.
 * Cloudinary tanımlıysa otomatik CDN URL'si oluşturur, aksi halde orijinal yolu döndürür.
 */
export function getCloudinaryImageUrl(src: string | null | undefined, defaultFallback = "/eurosianviptransferlogo.png"): string {
  if (!src) src = defaultFallback;

  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  const { cloudName } = getCloudinaryConfig();
  if (cloudName) {
    // Cloudinary CDN URL formatı
    const cleanPath = src.startsWith("/") ? src.slice(1) : src;
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/v1/eurosian-vip-transfer/${cleanPath}`;
  }

  return src;
}
