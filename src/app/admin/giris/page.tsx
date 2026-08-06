"use client";

import { Suspense } from "react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminGirisPage() {
  return (
    <main className="ev-login-page-container">
      <style jsx>{`
        .ev-login-page-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.12) 0%, rgba(10, 14, 23, 0.98) 60%, rgba(5, 7, 12, 1) 100%);
        }
        @media (min-height: 700px) {
          .ev-login-page-container {
            padding-top: 60px;
          }
        }
      `}</style>
      <Suspense fallback={<div className="ev-card" style={{ padding: 24, textAlign: "center", color: "#d4af37" }}>Giriş paneli yükleniyor…</div>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
