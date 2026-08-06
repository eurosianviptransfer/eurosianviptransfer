"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";

const loginHubCopy = {
  tr: {
    eyebrow: "Eurosian VIP Transfer · Portallar",
    title: "Çalışma Alanınızı Seçin",
    lead: "Sisteme tanımlı rolünüze ait giriş portalını seçerek devam edin.",
    adminLabel: "OPERASYON & YÖNETİM",
    adminTitle: "Admin Portalı",
    adminDesc: "Rezervasyonlar, filo, hakedişler ve sistem yönetimi",
    driverLabel: "SAHA EKİBİ",
    driverTitle: "Şoför Portalı",
    driverDesc: "Atanan işler, transfer durumları ve güzergah takibi",
    greeterLabel: "SAHA EKİBİ",
    greeterTitle: "Karşılamacı Portalı",
    greeterDesc: "Karşılama, misafir yönlendirme ve şoföre teslim akışı",
  },
  en: {
    eyebrow: "Eurosian VIP Transfer · Portals",
    title: "Choose Your Workspace",
    lead: "Select the login portal corresponding to your system role.",
    adminLabel: "OPERATIONS & MANAGEMENT",
    adminTitle: "Admin Portal",
    adminDesc: "Manage bookings, fleet, payouts and system settings",
    driverLabel: "FIELD TEAM",
    driverTitle: "Driver Portal",
    driverDesc: "Assigned trips, transfer status updates and navigation",
    greeterLabel: "FIELD TEAM",
    greeterTitle: "Greeter Portal",
    greeterDesc: "Welcome workflow, guest assistance and driver handoff",
  },
  de: {
    eyebrow: "Eurosian VIP Transfer · Portale",
    title: "Wählen Sie Ihren Arbeitsbereich",
    lead: "Wählen Sie das Anmeldeportal für Ihre Systemrolle aus.",
    adminLabel: "BETRIEB & MANAGEMENT",
    adminTitle: "Admin-Portal",
    adminDesc: "Buchungen, Flotte, Auszahlungen und Einstellungen verwalten",
    driverLabel: "FELDTEAM",
    driverTitle: "Fahrer-Portal",
    driverDesc: "Zugewiesene Fahrten, Statusaktualisierungen und Navigation",
    greeterLabel: "FELDTEAM",
    greeterTitle: "Begrüßer-Portal",
    greeterDesc: "Empfangsprozess, Gästebetreuung und Übergabe an den Fahrer",
  },
  ru: {
    eyebrow: "Eurosian VIP Transfer · Порталы",
    title: "Выберите рабочую область",
    lead: "Выберите портал входа, соответствующий вашей роли.",
    adminLabel: "ОПЕРАЦИИ И УПРАВЛЕНИЕ",
    adminTitle: "Портал Админа",
    adminDesc: "Управление бронированиями, автопарком, выплатами и настройками",
    driverLabel: "ПОЛЕВАЯ КОМАНДА",
    driverTitle: "Портал Водителя",
    driverDesc: "Назначенные рейсы, статусы трансферов и маршруты",
    greeterLabel: "ПОЛЕВАЯ КОМАНДА",
    greeterTitle: "Портал Встречающего",
    greeterDesc: "Встреча гостей, сопровождение и передача водителю",
  },
};

export default function GirisHubPage() {
  const { locale } = useLocale();
  const params = useSearchParams();
  const copy = (loginHubCopy as Record<string, typeof loginHubCopy.tr>)[locale] ?? loginHubCopy.en;
  const reason = params.get("reason");

  return (
    <main className="ev-hub-container">
      <style jsx>{`
        .ev-hub-container {
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 14, 23, 1) 70%);
        }

        .ev-hub-header {
          text-align: center;
          max-width: 640px;
          margin-bottom: 40px;
        }

        .ev-hub-eyebrow {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #d4af37;
          text-transform: uppercase;
          margin-bottom: 12px;
          background: rgba(212, 175, 55, 0.1);
          padding: 6px 16px;
          border-radius: 99px;
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .ev-hub-title {
          font-size: 36px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }

        .ev-hub-lead {
          font-size: 16px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }

        .ev-alert {
          max-width: 800px;
          width: 100%;
          margin-bottom: 24px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(234, 179, 8, 0.12);
          border: 1px solid rgba(234, 179, 8, 0.3);
          color: #fef08a;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ev-hub-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1040px;
          width: 100%;
        }

        .ev-role-card {
          background: rgba(18, 24, 38, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .ev-role-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: transparent;
          transition: background 0.3s;
        }

        .ev-role-card--admin::before {
          background: linear-gradient(90deg, #d4af37, #aa771c);
        }

        .ev-role-card--driver::before {
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        }

        .ev-role-card--greeter::before {
          background: linear-gradient(90deg, #10b981, #047857);
        }

        .ev-role-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
          background: rgba(26, 34, 52, 0.85);
        }

        .ev-role-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }

        .ev-role-card:hover .ev-role-icon {
          transform: scale(1.08);
        }

        .ev-role-icon--admin {
          background: rgba(212, 175, 55, 0.15);
          color: #f3ce72;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .ev-role-icon--driver {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .ev-role-icon--greeter {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .ev-card-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .ev-card-h2 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px 0;
        }

        .ev-card-desc {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .ev-card-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: gap 0.2s;
        }

        .ev-role-card--admin .ev-card-action { color: #f3ce72; }
        .ev-role-card--driver .ev-card-action { color: #60a5fa; }
        .ev-role-card--greeter .ev-card-action { color: #34d399; }

        .ev-role-card:hover .ev-card-action {
          gap: 10px;
        }

        @media (max-width: 900px) {
          .ev-hub-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
          }

          .ev-hub-title {
            font-size: 28px;
          }

          .ev-role-card {
            padding: 24px 20px;
          }
        }
      `}</style>

      <div className="ev-hub-header">
        <div className="ev-hub-eyebrow">{copy.eyebrow}</div>
        <h1 className="ev-hub-title">{copy.title}</h1>
        <p className="ev-hub-lead">{copy.lead}</p>
      </div>

      {reason === "other_device" && (
        <div className="ev-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div><strong>Oturum Sonlandırıldı:</strong> Hesabınıza başka bir cihaz veya tarayıcıdan giriş yapıldığı için mevcut cihazınızdaki oturum güvenlik gereği kapatılmıştır. Lütfen tekrar giriş yapın.</div>
        </div>
      )}

      <div className="ev-hub-grid">
        <Link href={`/admin/giris?lang=${locale}`} className="ev-role-card ev-role-card--admin">
          <div className="ev-role-icon ev-role-icon--admin">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
            </svg>
          </div>
          <div className="ev-card-tag">{copy.adminLabel}</div>
          <h2 className="ev-card-h2">{copy.adminTitle}</h2>
          <div className="ev-card-desc">{copy.adminDesc}</div>
          <div className="ev-card-action">
            Portala Giriş Yap
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </Link>

        <Link href={`/sofor/giris?lang=${locale}`} className="ev-role-card ev-role-card--driver">
          <div className="ev-role-icon ev-role-icon--driver">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.9 2 11.1V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <div className="ev-card-tag">{copy.driverLabel}</div>
          <h2 className="ev-card-h2">{copy.driverTitle}</h2>
          <div className="ev-card-desc">{copy.driverDesc}</div>
          <div className="ev-card-action">
            Portala Giriş Yap
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </Link>

        <Link href={`/karsilamaci/giris?lang=${locale}`} className="ev-role-card ev-role-card--greeter">
          <div className="ev-role-icon ev-role-icon--greeter">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="ev-card-tag">{copy.greeterLabel}</div>
          <h2 className="ev-card-h2">{copy.greeterTitle}</h2>
          <div className="ev-card-desc">{copy.greeterDesc}</div>
          <div className="ev-card-action">
            Portala Giriş Yap
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </Link>
      </div>
    </main>
  );
}
