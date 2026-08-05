import { Suspense } from "react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminGirisPage() {
  return (
    <main className="ev-page" style={{ marginTop: 60 }}>
      <div className="ev-eyebrow">Eurosian VIP Transfer</div>
      <h1 className="ev-h1" style={{ marginBottom: 16 }}>Admin Girişi</h1>
      <Suspense fallback={<div className="ev-card">Yükleniyor…</div>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
