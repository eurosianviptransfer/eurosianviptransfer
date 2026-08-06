"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import Link from "next/link";

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

  const isDriver = expectedRole === "DRIVER";
  const roleTitle = isDriver ? "Şoför Girişi" : "Karşılamacı Girişi";
  const roleSubtitle = isDriver
    ? "Atanan transferleri ve görevleri yönetmek için giriş yapın."
    : "Havalimanı karşılama ve araç teslim akışları için giriş yapın.";

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
          background: ${isDriver ? "rgba(59, 130, 246, 0.12)" : "rgba(16, 185, 129, 0.12)"};
          border: 1px solid ${isDriver ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"};
          border-radius: 99px;
          color: ${isDriver ? "#60a5fa" : "#34d399"};
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
          border-color: ${isDriver ? "#3b82f6" : "#10b981"};
          box-shadow: 0 0 0 3px ${isDriver ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.15)"};
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
          background: ${isDriver
            ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
            : "linear-gradient(135deg, #059669 0%, #047857 100%)"};
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: ${isDriver
            ? "0 4px 15px rgba(37, 99, 235, 0.3)"
            : "0 4px 15px rgba(5, 150, 105, 0.3)"};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .ev-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: ${isDriver
            ? "0 6px 20px rgba(37, 99, 235, 0.4)"
            : "0 6px 20px rgba(5, 150, 105, 0.4)"};
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
          color: ${isDriver ? "#60a5fa" : "#34d399"};
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
          {isDriver ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.9 2 11.1V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )}
          {isDriver ? "Saha Ekibi · Şoför" : "Saha Ekibi · Karşılamacı"}
        </div>
        <h2>{roleTitle}</h2>
        <p>{roleSubtitle}</p>
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
        disabled={loading || !phone || !password}
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
        {isDriver ? (
          <Link href="/karsilamaci/giris">Karşılamacı Girişi →</Link>
        ) : (
          <Link href="/sofor/giris">Şoför Girişi →</Link>
        )}
      </div>
    </div>
  );
}