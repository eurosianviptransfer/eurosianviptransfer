"use client";

import Link from "next/link";
import { useLocale } from "@/components/LanguageProvider";

const loginHubCopy = {
  tr: {
    eyebrow: "Eurosian VIP Transfer · Ekip",
    title: "Çalışma alanınızı seçin",
    lead: "Size tanımlı rolün giriş ekranından devam edin.",
    adminLabel: "Operasyon",
    adminTitle: "Admin",
    adminDesc: "Rezervasyon, filo ve fiyat yönetimi",
    driverLabel: "Saha",
    driverTitle: "Şoför",
    driverDesc: "Atanan işler ve transfer durumu",
    greeterLabel: "Saha",
    greeterTitle: "Karşılamacı",
    greeterDesc: "Karşılama ve şoföre teslim akışı",
  },
  en: {
    eyebrow: "Eurosian VIP Transfer · Team",
    title: "Choose your workspace",
    lead: "Continue from the login screen assigned to your role.",
    adminLabel: "Operations",
    adminTitle: "Admin",
    adminDesc: "Manage bookings, fleet and pricing",
    driverLabel: "Field",
    driverTitle: "Driver",
    driverDesc: "Assigned jobs and transfer status",
    greeterLabel: "Field",
    greeterTitle: "Greeter",
    greeterDesc: "Guest welcome and handoff flow",
  },
  de: {
    eyebrow: "Eurosian VIP Transfer · Team",
    title: "Wählen Sie Ihren Arbeitsbereich",
    lead: "Fahren Sie über den für Ihre Rolle zugewiesenen Login fort.",
    adminLabel: "Betrieb",
    adminTitle: "Admin",
    adminDesc: "Buchungen, Flotte und Preise verwalten",
    driverLabel: "Feld",
    driverTitle: "Fahrer",
    driverDesc: "Zugewiesene Aufträge und Transferstatus",
    greeterLabel: "Feld",
    greeterTitle: "Begrüßer",
    greeterDesc: "Begrüßung von Gästen und Übergabeprozess",
  },
  ru: {
    eyebrow: "Eurosian VIP Transfer · Команда",
    title: "Выберите рабочую область",
    lead: "Продолжите со страницы входа, назначенной вашей роли.",
    adminLabel: "Операции",
    adminTitle: "Админ",
    adminDesc: "Управление бронированиями, парком и ценами",
    driverLabel: "Поля",
    driverTitle: "Водитель",
    driverDesc: "Назначенные задания и статус трансфера",
    greeterLabel: "Поля",
    greeterTitle: "Встречающий",
    greeterDesc: "Встреча гостей и передача водителю",
  },
};

export default function GirisHubPage() {
  const { locale } = useLocale();
  const copy = (loginHubCopy as Record<string, typeof loginHubCopy.tr>)[locale] ?? loginHubCopy.en;

  return (
    <main className="ev-page">
      <div className="ev-eyebrow">{copy.eyebrow}</div>
      <h1 className="ev-h1" style={{ marginTop: 10 }}>{copy.title}</h1>
      <p className="ev-muted" style={{ margin: "8px 0 24px" }}>{copy.lead}</p>
      <div className="ev-grid ev-grid--3">
        <Link href={`/admin/giris?lang=${locale}`} className="ev-card ev-link-card" style={{ display: "block", textDecoration: "none" }}>
          <div className="ev-eyebrow">{copy.adminLabel}</div><h2 style={{ margin: "8px 0 6px", fontSize: 20 }}>{copy.adminTitle}</h2>
          <div className="ev-kpi-label">{copy.adminDesc}</div>
        </Link>
        <Link href={`/sofor/giris?lang=${locale}`} className="ev-card ev-link-card" style={{ display: "block", textDecoration: "none" }}>
          <div className="ev-eyebrow">{copy.driverLabel}</div><h2 style={{ margin: "8px 0 6px", fontSize: 20 }}>{copy.driverTitle}</h2>
          <div className="ev-kpi-label">{copy.driverDesc}</div>
        </Link>
        <Link href={`/karsilamaci/giris?lang=${locale}`} className="ev-card ev-link-card" style={{ display: "block", textDecoration: "none" }}>
          <div className="ev-eyebrow">{copy.greeterLabel}</div><h2 style={{ margin: "8px 0 6px", fontSize: 20 }}>{copy.greeterTitle}</h2>
          <div className="ev-kpi-label">{copy.greeterDesc}</div>
        </Link>
      </div>
    </main>
  );
}
