import { DriverApplicationForm } from "@/components/driver/DriverApplicationForm";
import { useLocale } from "@/components/LanguageProvider";
import { getDriverCopy } from "@/lib/driver-copy";

export default function DriverApplicationPage() {
  const { locale } = useLocale();
  const copy = getDriverCopy(locale);
  return (
    <main className="ev-page ev-page--wide">
      <div className="ev-eyebrow">{copy.eyebrow}</div>
      <h1 className="ev-h1">{copy.title}</h1>
      <p className="ev-muted" style={{ maxWidth: 720 }}>{copy.description}</p>
      <DriverApplicationForm />
    </main>
  );
}
