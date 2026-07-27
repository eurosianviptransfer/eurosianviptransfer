import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Next.js 16: middleware.ts → proxy.ts (dosya adı ve export adı değişti, mantık aynı).
 * /admin, /sofor, /karsilamaci altındaki sayfalar giriş + doğru rol gerektirir.
 * Her rolün kendi giriş sayfası var (/admin/giris, /sofor/giris, /karsilamaci/giris) —
 * bu sayfalar İSTİSNA: korumaya girmezler, yoksa girişe yönlendirme sonsuz döngüye girer.
 * Misafir akışı (/, /rezervasyon, /takip/*) herkese açık.
 *
 * "Thin Proxy" prensibi (Next.js 16): burada sadece JWT'nin varlığı/rolü kontrol
 * edilir, ağır bir DB sorgusu yapılmaz — asıl yetki doğrulaması server component'lerde
 * (getServerSession) tekrar yapılıyor.
 */
const ROLE_BY_PREFIX: Record<string, { role: string; loginPath: string }> = {
  "/admin": { role: "ADMIN", loginPath: "/admin/giris" },
  "/sofor": { role: "DRIVER", loginPath: "/sofor/giris" },
  "/karsilamaci": { role: "GREETER", loginPath: "/karsilamaci/giris" },
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const prefix = Object.keys(ROLE_BY_PREFIX).find((p) => pathname.startsWith(p));
  if (!prefix) return NextResponse.next();

  const { role, loginPath } = ROLE_BY_PREFIX[prefix];
  if (pathname === loginPath) return NextResponse.next(); // giriş sayfasının kendisi korumasız

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== role) {
    const signInUrl = new URL(loginPath, req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sofor/:path*", "/karsilamaci/:path*"],
};
