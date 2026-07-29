export const navLabels: Record<string, { driver: string; applicationTrack: string; greeter: string }> = {
  tr: { driver: "Şoför ol", applicationTrack: "Başvuru takip", greeter: "Karşılamacı ol" },
  en: { driver: "Apply as driver", applicationTrack: "Application tracking", greeter: "Apply as greeter" },
  de: { driver: "Als Fahrer bewerben", applicationTrack: "Bewerbung verfolgen", greeter: "Als Empfangskraft bewerben" },
  fr: { driver: "Postuler comme chauffeur", applicationTrack: "Suivi de candidature", greeter: "Postuler comme réception" },
  es: { driver: "Postular como conductor", applicationTrack: "Seguimiento de la solicitud", greeter: "Postular como recepcionista" },
  it: { driver: "Candidati come autista", applicationTrack: "Traccia candidatura", greeter: "Candidati come receptionist" },
  ru: { driver: "Подать заявку водителем", applicationTrack: "Отслеживание заявки", greeter: "Подать заявку как встречающий" },
  ar: { driver: "التقدم كسائق", applicationTrack: "متابعة الطلب", greeter: "التقدم كمستقبل" },
  zh: { driver: "申请成为司机", applicationTrack: "申请追踪", greeter: "申请迎宾员" },
  ja: { driver: "ドライバー応募", applicationTrack: "応募状況の確認", greeter: "歓迎スタッフに応募" },
  pt: { driver: "Candidatar-se como motorista", applicationTrack: "Acompanhamento de candidatura", greeter: "Candidatar-se como recepcionista" },
  nl: { driver: "Aanmelden als chauffeur", applicationTrack: "Aanvraag volgen", greeter: "Aanmelden als ontvangstmedewerker" },
};

export function getNavLabel(locale: string, key: "driver" | "applicationTrack" | "greeter") {
  const l = navLabels[locale] ?? navLabels[locale.split("-")[0]] ?? navLabels.en;
  return l[key];
}
