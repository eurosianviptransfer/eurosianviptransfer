"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import Link from "next/link";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reason = params.get("reason");
  const logoUrl = getCloudinaryImageUrl("/eurosianviptransferlogo.png");

  async function submit() {
    if (!email || !password || loading) return;
    setError(null);
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signIn("admin-credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

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
    <div className="ev-auth-wrapper">
      <style jsx>{`
        .ev-auth-wrapper {
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
        }

        .ev-role-tabs {
          display: flex;
          background: rgba(10, 14, 23, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 20px;
          gap: 4px;
        }

        .ev-role-tab {
          flex: 1;
          text-align: center;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .ev-role-tab--active {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(170, 119, 28, 0.2) 100%);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #f3ce72;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
        }

        .ev-role-tab:hover:not(.ev-role-tab--active) {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.05);
        }

        .ev-auth-card {
          background: linear-gradient(145deg, rgba(18, 24, 38, 0.9) 0%, rgba(10, 14, 23, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          padding: 36px 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.1);
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
          overflow: hidden;
        }

        .ev-auth-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #fef08a, #d4af37);
        }

        .ev-logo-box {
          display: flex;
          justify-content: center;
          margin-bottom: 4px;
        }

        .ev-logo-img {
          height: 44px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.2));
        }

        .ev-auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 99px;
          color: #f3ce72;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          width: fit-content;
          margin: 0 auto;
        }

        .ev-auth-header {
          text-align: center;
        }

        .ev-auth-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          margin: 8px 0 4px 0;
          letter-spacing: -0.3px;
        }

        .ev-auth-header p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
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
          color: #d4af37;
          pointer-events: none;
          display: flex;
          align-items: center;
          opacity: 0.85;
        }

        .ev-field-input {
          width: 100%;
          background: rgba(10, 14, 23, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 14px 14px 14px 44px;
          color: #ffffff;
          font-size: 15px;
          outline: none;
          transition: all 0.25s ease;
        }

        .ev-field-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.18);
          background: rgba(10, 14, 23, 0.98);
        }

        .ev-eye-btn {
          position: absolute;
          right: 14px;
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
          color: #d4af37;
        }

        .ev-alert {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
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
          border-radius: 14px;
          padding: 15px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
        }

        .ev-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.45);
          background: linear-gradient(135deg, #e6c24d 0%, #ba8629 100%);
        }

        .ev-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .ev-auth-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 18px;
          margin-top: 4px;
        }

        .ev-auth-footer a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ev-auth-footer a:hover {
          color: #d4af37;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .ev-auth-card {
            padding: 26px 20px;
            border-radius: 20px;
          }
        }
      `}</style>

      {/* Role Tabs */}
      <div className="ev-role-tabs">
        <span className="ev-role-tab ev-role-tab--active">Admin</span>
        <Link href="/sofor/giris" className="ev-role-tab">Şoför</Link>
        <Link href="/karsilamaci/giris" className="ev-role-tab">Karşılamacı</Link>
      </div>

      <div className="ev-auth-card">
        <div className="ev-logo-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Eurosian VIP Transfer" className="ev-logo-img" />
        </div>

        <div className="ev-auth-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
          </svg>
          YÖNETİM PORTALI
        </div>

        <div className="ev-auth-header">
          <h2>Admin Girişi</h2>
          <p>Operasyon ve rezervasyon yönetim portalına erişim sağlayın.</p>
        </div>

        {reason === "other_device" && (
          <div className="ev-alert ev-alert--warning">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>Hesabınıza başka bir cihazdan giriş yapıldığı için bu oturum kapatıldı.</div>
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
              style={{ paddingRight: 44 }}
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
              <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"/>
              </svg>
              Giriş Yapılıyor...
            </>
          ) : (
            <>
              Giriş Yap
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </>
          )}
        </button>

        <div className="ev-auth-footer">
          <Link href="/giris">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Rol Hub
          </Link>
          <Link href="/sofor/giris">
            Saha Portalı
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
