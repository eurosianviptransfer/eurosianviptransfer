export const navLabels: Record<string, { driver: string; applicationTrack: string }> = {
  tr: { driver: "Şoför ol", applicationTrack: "Başvuru takip" },
  en: { driver: "Apply as driver", applicationTrack: "Application tracking" },
  de: { driver: "Als Fahrer bewerben", applicationTrack: "Bewerbung verfolgen" },
  fr: { driver: "Postuler comme chauffeur", applicationTrack: "Suivi de candidature" },
  es: { driver: "Postular como conductor", applicationTrack: "Seguimiento de la solicitud" },
  it: { driver: "Candidati come autista", applicationTrack: "Traccia candidatura" },
  ru: { driver: "Подать заявку водителем", applicationTrack: "Отслеживание заявки" },
  ar: { driver: "التقدم كسائق", applicationTrack: "متابعة الطلب" },
  zh: { driver: "申请成为司机", applicationTrack: "申请追踪" },
  ja: { driver: "ドライバー応募", applicationTrack: "応募状況の確認" },
  pt: { driver: "Candidatar-se como motorista", applicationTrack: "Acompanhamento de candidatura" },
  nl: { driver: "Aanmelden als chauffeur", applicationTrack: "Aanvraag volgen" },
};

export function getNavLabel(locale: string, key: "driver" | "applicationTrack") {
  const l = navLabels[locale] ?? navLabels[locale.split("-")[0]] ?? navLabels.en;
  return l[key];
}
