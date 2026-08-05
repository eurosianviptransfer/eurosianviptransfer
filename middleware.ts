import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed locales mirror src/lib/i18n locales.
const ALLOWED = ['en', 'tr', 'nl', 'de', 'ru'] as const;

export function middleware(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get('lang');
    if (lang && ALLOWED.includes(lang as typeof ALLOWED[number])) {
      const res = NextResponse.next();
      // set a cookie that will be available server-side on subsequent requests
      // maxAge 1 year
      res.cookies.set('ev-locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return res;
    }
  } catch (e) {
    // no-op
  }
  return NextResponse.next();
}

export const config = {
  // run middleware on all routes
  matcher: '/:path*',
};
