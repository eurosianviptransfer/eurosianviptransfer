"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import Link from "next/link";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

interface Props {
  expectedRole: "DRIVER" | "GREETER";
  defaultRedirect: string;
}

export function PhonePasswordForm({ expectedRole, defaultRedirect }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reason = params.get("reason");
  const logoUrl = getCloudinaryImageUrl("/eurosianviptransferlogo.png");

  const isDriver = expectedRole === "DRIVER";
  const roleTitle = isDriver ? "Şoför Girişi" : "Karşılamacı Girişi";
  const roleSubtitle = isDriver
    ? "Atanan VIP transferleri ve saha görevlerinizi yönetin."
    : "Havalimanı misafir karşılama ve araç teslim işlemlerini yürütün.";

  const primaryColor = isDriver ? "#3b82f6" : "#10b981";
  const primaryGlow = isDriver ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)";

  async function submit() {
    if (loading || !phone || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("phone-credentials", {
        redirect: false,
        phone,
        password,
        expectedRole,
      });

      if (res?.error) {
        setError("Telefon numarası veya şifre hatalı.");
        return;
      }

      router.push(safeCallbackUrl(params.get("callbackUrl"), defaultRedirect));
    } catch (err) {
      console.error(err);
      setError("Giriş sırasında bir hata oluştu.");
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
          background: ${isDriver
            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(29, 78, 216, 0.2) 100%)"
            : "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(4, 120, 87, 0.2) 100%)"};
          border: 1px solid ${isDriver ? "rgba(59, 130, 246, 0.4)" : "rgba(16, 185, 129, 0.4)"};
          color: ${isDriver ? "#60a5fa" : "#34d399"};
          box-shadow: 0 4px 12px ${primaryGlow};
        }

        .ev-role-tab:hover:not(.ev-role-tab--active) {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.05);
        }

        .ev-auth-card {
          background: linear-gradient(145deg, rgba(18, 24, 38, 0.9) 0%, rgba(10, 14, 23, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid ${isDriver ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)"};
          border-radius: 24px;
          padding: 36px 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 30px ${primaryGlow};
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
          background: ${isDriver
            ? "linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)"
            : "linear-gradient(90deg, #10b981, #34d399, #10b981)"};
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
          filter: drop-shadow(0 4px 12px ${primaryGlow});
        }

        .ev-auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          background: ${isDriver ? "rgba(59, 130, 246, 0.12)" : "rgba(16, 185, 129, 0.12)"};
          border: 1px solid ${isDriver ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"};
          border-radius: 99px;
          color: ${isDriver ? "#60a5fa" : "#34d399"};
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
          color: ${primaryColor};
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
          border-color: ${primaryColor};
          box-shadow: 0 0 0 4px ${primaryGlow};
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
          color: ${primaryColor};
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
          background: ${isDriver
            ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
            : "linear-gradient(135deg, #059669 0%, #047857 100%)"};
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 15px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: ${isDriver
            ? "0 6px 20px rgba(37, 99, 235, 0.35)"
            : "0 6px 20px rgba(5, 150, 105, 0.35)"};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
        }

        .ev-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: ${isDriver
            ? "0 8px 25px rgba(37, 99, 235, 0.5)"
            : "0 8px 25px rgba(5, 150, 105, 0.5)"};
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
          color: ${primaryColor};
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
        <Link href="/admin/giris" className="ev-role-tab">Admin</Link>
        <Link href="/sofor/giris" className={`ev-role-tab ${isDriver ? "ev-role-tab--active" : ""}`}>
          Şoför
        </Link>
        <Link href="/karsilamaci/giris" className={`ev-role-tab ${!isDriver ? "ev-role-tab--active" : ""}`}>
          Karşılamacı
        </Link>
      </div>

      <div className="ev-auth-card">
        <div className="ev-logo-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Eurosian VIP Transfer" className="ev-logo-img" />
        </div>

        <div className="ev-auth-badge">
          {isDriver ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.9 2 11.1V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )}
          {isDriver ? "SAHA EKİBİ · ŞOFÖR" : "SAHA EKİBİ · KARŞILAMACI"}
        </div>

        <div className="ev-auth-header">
          <h2>{roleTitle}</h2>
          <p>{roleSubtitle}</p>
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
          <label className="ev-input-label">Telefon Numarası</label>
          <div className="ev-input-wrapper">
            <span className="ev-input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <input
              className="ev-field-input"
              type="tel"
              placeholder="05xx xxx xx xx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
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
          disabled={loading || !phone || !password}
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
          {isDriver ? (
            <Link href="/karsilamaci/giris">
              Karşılamacı Portalı
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ) : (
            <Link href="/sofor/giris">
              Şoför Portalı
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}