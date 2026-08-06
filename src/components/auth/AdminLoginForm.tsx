"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import Link from "next/link";

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reason = params.get("reason");

  async function submit() {
    if (!email || !password || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("admin-credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("E-posta adresi veya şifre hatalı.");
        return;
      }
      router.push(safeCallbackUrl(params.get("callbackUrl"), "/admin"));
    } catch {
      setError("Giriş yapılırken sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ev-auth-card">
      <style jsx>{`
        .ev-auth-card {
          background: rgba(18, 24, 38, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 28px;
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.08);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ev-auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 99px;
          color: #f3ce72;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          width: fit-content;
        }

        .ev-auth-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 8px 0 4px 0;
        }

        .ev-auth-header p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        .ev-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ev-input-label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .ev-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ev-input-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .ev-field-input {
          width: 100%;
          background: rgba(10, 14, 23, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 12px 14px 12px 42px;
          color: #ffffff;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
        }

        .ev-field-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
          background: rgba(10, 14, 23, 0.95);
        }

        .ev-eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .ev-eye-btn:hover {
          color: #f1f5f9;
        }

        .ev-alert {
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.4;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ev-alert--error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .ev-alert--warning {
          background: rgba(234, 179, 8, 0.12);
          border: 1px solid rgba(234, 179, 8, 0.3);
          color: #fef08a;
        }

        .ev-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
          color: #0b0f19;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .ev-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
          background: linear-gradient(135deg, #e5be48 0%, #bb8524 100%);
        }

        .ev-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .ev-auth-footer {
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 16px;
        }

        .ev-auth-footer a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .ev-auth-footer a:hover {
          color: #d4af37;
        }

        @media (max-width: 480px) {
          .ev-auth-card {
            padding: 24px 20px;
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="ev-auth-header">
        <div className="ev-auth-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
          </svg>
          Yönetim Portalı
        </div>
        <h2>Admin Girişi</h2>
        <p>Eurosian VIP Transfer operasyon hesabınızla oturum açın.</p>
      </div>

      {reason === "other_device" && (
        <div className="ev-alert ev-alert--warning">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>Farklı bir cihazdan giriş yapıldığı için bu cihazdaki oturum kapatıldı.</div>
        </div>
      )}

      {error && (
        <div className="ev-alert ev-alert--error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <div>{error}</div>
        </div>
      )}

      <div className="ev-input-group">
        <label className="ev-input-label">E-Posta Adresi</label>
        <div className="ev-input-wrapper">
          <span className="ev-input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <input
            className="ev-field-input"
            type="email"
            placeholder="admin@eurosianviptransfer.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      </div>

      <div className="ev-input-group">
        <label className="ev-input-label">Şifre</label>
        <div className="ev-input-wrapper">
          <span className="ev-input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <input
            className="ev-field-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={{ paddingRight: 42 }}
          />
          <button
            type="button"
            className="ev-eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="ev-submit-btn"
        disabled={loading || !email || !password}
        onClick={submit}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"/>
            </svg>
            Giriş Yapılıyor...
          </>
        ) : (
          "Giriş Yap"
        )}
      </button>

      <div className="ev-auth-footer">
        <Link href="/giris">← Rol Seçimi</Link>
        <Link href="/sofor/giris">Saha Girişi →</Link>
      </div>
    </div>
  );
}
