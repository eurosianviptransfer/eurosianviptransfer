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
