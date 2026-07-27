import { Suspense } from "react";
import { PhonePasswordForm } from "@/components/auth/PhonePasswordForm";

export default function KarsilamaciGirisPage() {
  return (
    <main className="ev-page" style={{ marginTop: 60 }}>
      <div className="ev-eyebrow">Eurosian VIP Transfer</div>
      <h1 className="ev-h1" style={{ marginBottom: 16 }}>Karşılamacı Girişi</h1>
      <Suspense fallback={<div className="ev-card">Yükleniyor…</div>}>
        <PhonePasswordForm expectedRole="GREETER" defaultRedirect="/karsilamaci" />
      </Suspense>
    </main>
  );
}
