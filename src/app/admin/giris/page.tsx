"use client";

import { Suspense } from "react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminGirisPage() {
  return (
    <main className="ev-login-page-container">
      <style jsx>{`
        .ev-login-page-container {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.07) 0%, rgba(10, 14, 23, 1) 75%);
        }
      `}</style>
      <Suspense fallback={<div className="ev-card" style={{ padding: 24, textAlign: "center" }}>Yükleniyor…</div>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
