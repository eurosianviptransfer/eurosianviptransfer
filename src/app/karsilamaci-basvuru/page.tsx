"use client";

import { GreeterApplicationForm } from "@/components/greeter/GreeterApplicationForm";
import { useLocale } from "@/components/LanguageProvider";

export default function GreeterApplicationPage() {
  const { locale } = useLocale();
  return (
    <main className="ev-page ev-page--wide">
      <div className="ev-eyebrow">Karşılamacı başvurusu</div>
      <h1 className="ev-h1">Karşılamacı ol</h1>
      <p className="ev-muted" style={{ maxWidth: 720 }}>Karşılamacı olarak bizimle çalışmak istiyorsanız aşağıdaki formu doldurun. Başvurunuz incelenecek ve sonuç size bildirilecektir.</p>
      <GreeterApplicationForm />
    </main>
  );
}
