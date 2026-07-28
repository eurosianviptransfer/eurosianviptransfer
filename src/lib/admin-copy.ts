export type AdminCopy = {
  title: string;
  pricingTable: string;
  sections: {
    liveOnline: string;
    fleetDrivers: string;
    greeters: string;
    reservations: string;
  };
  summary: {
    title: string;
    live: string;
    pending: string;
    approved: string;
    completed: string;
    liveOperations: string;
    noItems: string;
    pendingReservations: string;
    pendingAssignments: string;
    completedItems: string;
  };
  stageLabels: Record<string, string>;
  bookingCard: {
    smallVehicle: string;
    largeVehicle: string;
    awaitingAdmin: string;
  };
  report: {
    title: string;
    subtitle: string;
    exportXlsx: string;
    exportCsv: string;
    exportPdf: string;
    print: string;
    filteredReservations: string;
    pendingLive: string;
    completedRevenue: string;
    completedJobs: string;
    collected: string;
    paymentStatus: string;
    totalPayout: string;
    filtersTitle: string;
    filtersSubtitle: string;
    filtersClear: string;
    statusLabel: string;
    paymentLabel: string;
    vehicleTypeLabel: string;
    driverLabel: string;
    greeterLabel: string;
    fromLabel: string;
    toLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    distributionTitle: string;
    financeTitle: string;
    lastSevenDaysTitle: string;
    reportTitle: string;
    reportSubtitle: string;
    noResults: string;
    tableHeaders: {
      codeDate: string;
      guest: string;
      route: string;
      assignment: string;
      status: string;
      payment: string;
      amount: string;
      payout: string;
    };
    emptyState: string;
  };
  profile: {
    title: string;
    subtitle: string;
    submit: string;
    loading: string;
    upload: string;
    fields: {
      name: string;
      email: string;
      phone: string;
      supplier: string;
      bio: string;
      theme: string;
      language: string;
      currentPassword: string;
      newPassword: string;
    };
    messages: {
      success: string;
      imageSuccess: string;
      imageError: string;
      saveError: string;
    };
  };
};

export function getAdminCopy(locale: string): AdminCopy {
  return adminCopy[locale] ?? adminCopy.en;
}

export const adminCopy: Record<string, AdminCopy> = {
  tr: {
    title: "Admin — Operasyon Panosu",
    pricingTable: "Fiyat Tablosu →",
    sections: { liveOnline: "Canlı Online", fleetDrivers: "Araç & Şoför", greeters: "Karşılamacılar", reservations: "Rezervasyonlar" },
    summary: {
      title: "Rezervasyon Yönetimi",
      live: "Canlı",
      pending: "Onay bekleyen",
      approved: "Atama bekleyen",
      completed: "Tamamlanan",
      liveOperations: "Canlı Operasyon",
      noItems: "Yok.",
      pendingReservations: "Rezervasyonlar — Onay Bekleyenler",
      pendingAssignments: "Atama Bekleyenler",
      completedItems: "Tamamlananlar",
    },
    stageLabels: { ASSIGNED: "Atandı", GREETER_CONFIRMED: "Karşılamacıda", EN_ROUTE: "Yolda", DROPPED_OFF: "Otelde Bırakıldı" },
    bookingCard: { smallVehicle: "Küçük araç — karşılamacı zorunlu", largeVehicle: "Büyük araç — karşılamacı opsiyonel", awaitingAdmin: "Admin tamamlaması bekleniyor" },
    report: {
      title: "Yönetim · Raporlama Merkezi",
      subtitle: "Operasyon analitiği",
      exportXlsx: "Excel (.xlsx)",
      exportCsv: "CSV",
      exportPdf: "PDF",
      print: "Yazdır",
      filteredReservations: "Filtrelenen rezervasyon",
      pendingLive: "bekleyen · canlı",
      completedRevenue: "Tamamlanan ciro",
      completedJobs: "tamamlanan iş",
      collected: "Tahsil edilen",
      paymentStatus: "Ödeme durumu: ödendi",
      totalPayout: "Toplam hakediş",
      filtersTitle: "Detaylı filtreleme",
      filtersSubtitle: "Birden fazla filtreyi birlikte kullanabilirsiniz.",
      filtersClear: "Filtreleri temizle",
      statusLabel: "Durum",
      paymentLabel: "Ödeme",
      vehicleTypeLabel: "Araç tipi",
      driverLabel: "Şoför",
      greeterLabel: "Karşılamacı",
      fromLabel: "Başlangıç",
      toLabel: "Bitiş",
      searchLabel: "Ara",
      searchPlaceholder: "Kod, misafir, destinasyon, uçuş...",
      distributionTitle: "Dağılım",
      financeTitle: "Finans",
      lastSevenDaysTitle: "Son 7 gün",
      reportTitle: "Operasyon raporu",
      reportSubtitle: "Tamamlanan ve filtrelenen işler",
      noResults: "Filtreye uyan kayıt bulunamadı.",
      tableHeaders: { codeDate: "Kod / tarih", guest: "Misafir", route: "Güzergâh", assignment: "Atama", status: "Durum", payment: "Ödeme", amount: "Tutar", payout: "Hakediş" },
      emptyState: "kayıt",
    },
    profile: {
      title: "Profil & Ayarlar",
      subtitle: "İsim, e-posta, şifre, dil, tema ve profil fotoğrafını burada yönetebilirsiniz.",
      submit: "Profili kaydet",
      loading: "Kaydediliyor…",
      upload: "Profil resmi yükle",
      fields: { name: "Ad Soyad", email: "E-posta", phone: "Telefon", supplier: "Firma / tedarik adı", bio: "Kısa bio", theme: "Tema", language: "Dil", currentPassword: "Mevcut şifre", newPassword: "Yeni şifre" },
      messages: { success: "Profil başarıyla güncellendi.", imageSuccess: "Profil resmi güncellendi.", imageError: "Profil resmi yüklenemedi.", saveError: "Profil güncellenemedi." },
    },
  },
  en: {
    title: "Admin — Operations Dashboard",
    pricingTable: "Pricing table →",
    sections: { liveOnline: "Live Online", fleetDrivers: "Vehicles & Drivers", greeters: "Greeters", reservations: "Reservations" },
    summary: {
      title: "Reservation Management",
      live: "Live",
      pending: "Pending approval",
      approved: "Pending assignment",
      completed: "Completed",
      liveOperations: "Live Operations",
      noItems: "None.",
      pendingReservations: "Reservations — Pending Approval",
      pendingAssignments: "Pending Assignments",
      completedItems: "Completed",
    },
    stageLabels: { ASSIGNED: "Assigned", GREETER_CONFIRMED: "Greeter confirmed", EN_ROUTE: "En route", DROPPED_OFF: "Dropped off" },
    bookingCard: { smallVehicle: "Small vehicle — greeter required", largeVehicle: "Large vehicle — greeter optional", awaitingAdmin: "Awaiting admin completion" },
    report: {
      title: "Management · Reporting Center",
      subtitle: "Operations analytics",
      exportXlsx: "Excel (.xlsx)",
      exportCsv: "CSV",
      exportPdf: "PDF",
      print: "Print",
      filteredReservations: "Filtered reservations",
      pendingLive: "pending · live",
      completedRevenue: "Completed revenue",
      completedJobs: "completed jobs",
      collected: "Collected",
      paymentStatus: "Payment status: paid",
      totalPayout: "Total payout",
      filtersTitle: "Advanced filters",
      filtersSubtitle: "You can combine multiple filters at once.",
      filtersClear: "Clear filters",
      statusLabel: "Status",
      paymentLabel: "Payment",
      vehicleTypeLabel: "Vehicle type",
      driverLabel: "Driver",
      greeterLabel: "Greeter",
      fromLabel: "From",
      toLabel: "To",
      searchLabel: "Search",
      searchPlaceholder: "Code, guest, destination, flight...",
      distributionTitle: "Distribution",
      financeTitle: "Finance",
      lastSevenDaysTitle: "Last 7 days",
      reportTitle: "Operations report",
      reportSubtitle: "Completed and filtered jobs",
      noResults: "No records matched the filters.",
      tableHeaders: { codeDate: "Code / date", guest: "Guest", route: "Route", assignment: "Assignment", status: "Status", payment: "Payment", amount: "Amount", payout: "Payout" },
      emptyState: "records",
    },
    profile: {
      title: "Profile & Settings",
      subtitle: "Manage your name, email, password, language, theme and profile photo here.",
      submit: "Save profile",
      loading: "Saving…",
      upload: "Upload profile photo",
      fields: { name: "Full name", email: "Email", phone: "Phone", supplier: "Company / supplier name", bio: "Short bio", theme: "Theme", language: "Language", currentPassword: "Current password", newPassword: "New password" },
      messages: { success: "Profile updated successfully.", imageSuccess: "Profile photo updated.", imageError: "Could not upload the profile photo.", saveError: "Could not update the profile." },
    },
  },
  de: {
    title: "Admin — Betriebsübersicht",
    pricingTable: "Preistabelle →",
    sections: { liveOnline: "Live Online", fleetDrivers: "Fahrzeuge & Fahrer", greeters: "Begrüßer", reservations: "Reservierungen" },
    summary: {
      title: "Reservierungsverwaltung",
      live: "Live",
      pending: "Genehmigung ausstehend",
      approved: "Zuordnung ausstehend",
      completed: "Abgeschlossen",
      liveOperations: "Live-Operationen",
      noItems: "Keine.",
      pendingReservations: "Reservierungen — Ausstehende Genehmigung",
      pendingAssignments: "Ausstehende Zuordnungen",
      completedItems: "Abgeschlossen",
    },
    stageLabels: { ASSIGNED: "Zugewiesen", GREETER_CONFIRMED: "Begrüßer bestätigt", EN_ROUTE: "Unterwegs", DROPPED_OFF: "Abgesetzt" },
    bookingCard: { smallVehicle: "Kleines Fahrzeug — Begrüßer erforderlich", largeVehicle: "Großes Fahrzeug — Begrüßer optional", awaitingAdmin: "Warte auf Admin-Abschluss" },
    report: {
      title: "Management · Berichtscenter",
      subtitle: "Operationsanalyse",
      exportXlsx: "Excel (.xlsx)",
      exportCsv: "CSV",
      exportPdf: "PDF",
      print: "Drucken",
      filteredReservations: "Gefilterte Reservierungen",
      pendingLive: "ausstehend · live",
      completedRevenue: "Abgeschlossener Umsatz",
      completedJobs: "abgeschlossene Aufträge",
      collected: "Eingezogen",
      paymentStatus: "Zahlungsstatus: bezahlt",
      totalPayout: "Gesamtauszahlung",
      filtersTitle: "Detaillierte Filter",
      filtersSubtitle: "Sie können mehrere Filter gleichzeitig verwenden.",
      filtersClear: "Filter löschen",
      statusLabel: "Status",
      paymentLabel: "Zahlung",
      vehicleTypeLabel: "Fahrzeugtyp",
      driverLabel: "Fahrer",
      greeterLabel: "Begrüßer",
      fromLabel: "Von",
      toLabel: "Bis",
      searchLabel: "Suche",
      searchPlaceholder: "Code, Gast, Ziel, Flug...",
      distributionTitle: "Verteilung",
      financeTitle: "Finanzen",
      lastSevenDaysTitle: "Letzte 7 Tage",
      reportTitle: "Operationsbericht",
      reportSubtitle: "Abgeschlossene und gefilterte Aufträge",
      noResults: "Keine Datensätze entsprechen den Filtern.",
      tableHeaders: { codeDate: "Code / Datum", guest: "Gast", route: "Route", assignment: "Zuweisung", status: "Status", payment: "Zahlung", amount: "Betrag", payout: "Auszahlung" },
      emptyState: "Datensätze",
    },
    profile: {
      title: "Profil & Einstellungen",
      subtitle: "Verwalten Sie hier Ihren Namen, Ihre E-Mail, Ihr Passwort, Ihre Sprache, Ihr Thema und Ihr Profilfoto.",
      submit: "Profil speichern",
      loading: "Wird gespeichert…",
      upload: "Profilfoto hochladen",
      fields: { name: "Vollständiger Name", email: "E-Mail", phone: "Telefon", supplier: "Firma / Lieferantenname", bio: "Kurzbiografie", theme: "Thema", language: "Sprache", currentPassword: "Aktuelles Passwort", newPassword: "Neues Passwort" },
      messages: { success: "Profil erfolgreich aktualisiert.", imageSuccess: "Profilfoto aktualisiert.", imageError: "Profilfoto konnte nicht hochgeladen werden.", saveError: "Profil konnte nicht aktualisiert werden." },
    },
  },
};
