"use client";

import { Suspense } from "react";
import { PhonePasswordForm } from "@/components/auth/PhonePasswordForm";

export default function KarsilamaciGirisPage() {
  return (
    <main className="ev-login-page-container">
      <style jsx>{`
        .ev-login-page-container {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.07) 0%, rgba(10, 14, 23, 1) 75%);
        }
      `}</style>
      <Suspense fallback={<div className="ev-card" style={{ padding: 24, textAlign: "center" }}>Yükleniyor…</div>}>
        <PhonePasswordForm expectedRole="GREETER" defaultRedirect="/karsilamaci" />
      </Suspense>
    </main>
  );
}
