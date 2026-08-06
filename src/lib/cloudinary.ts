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
 * Verilen resim/görsel yolunu Cloudinary CDN URL'sine veya geçerli statik yola dönüştürür.
 */
export function getCloudinaryImageUrl(src: string | null | undefined, defaultFallback = "/eurosianviptransferlogo.png"): string {
  const target = src?.trim() || defaultFallback;

  // Tam URL veya data URI ise doğrudan döndür
  if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("data:")) {
    return target;
  }

  // Yerel statik assets (public dizinindeki dosyalar) için güvenli erişim
  if (target.startsWith("/") || target.startsWith("media-library/") || target.startsWith("assets/")) {
    return target.startsWith("/") ? target : `/${target}`;
  }

  const { cloudName } = getCloudinaryConfig();
  if (cloudName && !target.includes("/")) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${target}`;
  }

  return target.startsWith("/") ? target : `/${target}`;
}
