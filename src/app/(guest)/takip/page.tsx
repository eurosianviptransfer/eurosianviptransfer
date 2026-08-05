import { getBookingCopy } from "@/lib/guest-copy";
import TrackBookingClient from "@/components/TrackBookingClient";
import { locales, type Locale } from "@/lib/i18n";

// Server component wrapper. Reads the lang query param server-side via searchParams
// so the initial HTML is rendered with the correct locale and strings.
export default function TrackBookingPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = searchParams?.lang;
  const serverLocale: Locale = (lang && locales.includes(lang as Locale) ? (lang as Locale) : "en");
  const copy = getBookingCopy(serverLocale);
  return <TrackBookingClient initialLocale={serverLocale} copy={copy} />;
}
