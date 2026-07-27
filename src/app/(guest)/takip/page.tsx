"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";

export default function TrackBookingPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const [code, setCode] = useState("");
  const copy = {
    tr: ["Rezervasyonunu takip et", "Rezervasyon kodunuzu girerek transfer durumunu görüntüleyin.", "Rezervasyon kodu", "Takibi aç"],
    en: ["Track your booking", "Enter your booking code to see your transfer status.", "Booking code", "Open tracking"],
    de: ["Buchung verfolgen", "Geben Sie Ihren Buchungscode ein, um den Transferstatus zu sehen.", "Buchungscode", "Tracking öffnen"],
    ru: ["Отследить бронь", "Введите код бронирования, чтобы увидеть статус трансфера.", "Код бронирования", "Открыть отслеживание"],
    ar: ["تتبع حجزك", "أدخل رمز الحجز لعرض حالة رحلة النقل.", "رمز الحجز", "فتح التتبع"],
    zh: ["查询您的订单", "输入订单编号，查看接送服务状态。", "订单编号", "打开查询"],
    ja: ["予約を確認", "予約番号を入力して、送迎状況をご確認ください。", "予約番号", "確認画面を開く"],
    nl: ["Volg uw boeking", "Voer uw boekingscode in om de status van uw transfer te bekijken.", "Boekingscode", "Tracking openen"],
    ro: ["Urmărește rezervarea", "Introdu codul rezervării pentru a vedea statusul transferului.", "Codul rezervării", "Deschide urmărirea"],
    uk: ["Відстежити бронювання", "Введіть код бронювання, щоб переглянути статус трансферу.", "Код бронювання", "Відкрити відстеження"],
    sv: ["Följ din bokning", "Ange bokningskoden för att se statusen för din transfer.", "Bokningskod", "Öppna spårning"],
    no: ["Følg bestillingen", "Skriv inn bestillingskoden for å se statusen på transferen.", "Bestillingskode", "Åpne sporing"],
    da: ["Følg din booking", "Indtast bookingkoden for at se status for din transfer.", "Bookingkode", "Åbn sporing"],
    es: ["Siga su reserva", "Introduzca el código de reserva para consultar el estado del traslado.", "Código de reserva", "Abrir seguimiento"],
    it: ["Segui la prenotazione", "Inserisci il codice della prenotazione per vedere lo stato del transfer.", "Codice prenotazione", "Apri il tracking"],
    pt: ["Acompanhe a sua reserva", "Introduza o código da reserva para consultar o estado do transfer.", "Código da reserva", "Abrir acompanhamento"],
    fr: ["Suivre votre réservation", "Saisissez le code de réservation pour consulter le statut du transfert.", "Code de réservation", "Ouvrir le suivi"],
    ko: ["예약 조회", "예약 코드를 입력하여 이동 서비스 상태를 확인하세요.", "예약 코드", "조회 열기"],
    th: ["ติดตามการจอง", "กรอกรหัสการจองเพื่อดูสถานะบริการรับส่งของคุณ", "รหัสการจอง", "เปิดการติดตาม"],
    az: ["Sifarişi izlə", "Transfer statusunu görmək üçün sifariş kodunuzu daxil edin.", "Sifariş kodu", "İzləməni aç"],
    el: ["Παρακολούθηση κράτησης", "Εισαγάγετε τον κωδικό κράτησης για να δείτε την κατάσταση της μεταφοράς.", "Κωδικός κράτησης", "Άνοιγμα παρακολούθησης"],
    ka: ["ჯავშნის თვალყურის დევნება", "შეიყვანეთ ჯავშნის კოდი ტრანსფერის სტატუსის სანახავად.", "ჯავშნის კოდი", "თვალყურის გახსნა"],
    pl: ["Śledź rezerwację", "Wpisz kod rezerwacji, aby sprawdzić status transferu.", "Kod rezerwacji", "Otwórz śledzenie"],
    hy: ["Հետևել ամրագրմանը", "Մուտքագրեք ամրագրման կոդը՝ տրանսֆերի կարգավիճակը տեսնելու համար։", "Ամրագրման կոդ", "Բացել հետևումը"],
    sr: ["Prati rezervaciju", "Unesite kod rezervacije da biste videli status transfera.", "Kod rezervacije", "Otvori praćenje"],
    mk: ["Следи резервација", "Внесете го кодот за резервација за да го видите статусот на трансферот.", "Код за резервација", "Отвори следење"],
    bs: ["Prati rezervaciju", "Unesite kod rezervacije da biste vidjeli status transfera.", "Kod rezervacije", "Otvori praćenje"],
    sq: ["Ndiq rezervimin", "Shkruani kodin e rezervimit për të parë statusin e transferit.", "Kodi i rezervimit", "Hap ndjekjen"],
    hi: ["बुकिंग ट्रैक करें", "ट्रांसफर की स्थिति देखने के लिए बुकिंग कोड दर्ज करें।", "बुकिंग कोड", "ट्रैकिंग खोलें"],
    ur: ["بکنگ ٹریک کریں", "ٹرانسفر کی صورتحال دیکھنے کے لیے بکنگ کوڈ درج کریں۔", "بکنگ کوڈ", "ٹریکنگ کھولیں"],
    bn: ["বুকিং ট্র্যাক করুন", "ট্রান্সফারের অবস্থা দেখতে বুকিং কোড লিখুন।", "বুকিং কোড", "ট্র্যাকিং খুলুন"],
    fa: ["پیگیری رزرو", "برای مشاهده وضعیت ترانسفر، کد رزرو را وارد کنید.", "کد رزرو", "باز کردن پیگیری"],
    he: ["מעקב אחר הזמנה", "הזינו את קוד ההזמנה כדי לראות את סטטוס ההסעה.", "קוד הזמנה", "פתיחת מעקב"],
    bg: ["Проследете резервацията", "Въведете кода на резервацията, за да видите статуса на трансфера.", "Код на резервация", "Отвори проследяване"],
    cs: ["Sledovat rezervaci", "Zadejte kód rezervace a zobrazte stav transferu.", "Kód rezervace", "Otevřít sledování"],
    hu: ["Foglalás követése", "Adja meg a foglalási kódot a transzfer állapotának megtekintéséhez.", "Foglalási kód", "Követés megnyitása"],
    sk: ["Sledovať rezerváciu", "Zadajte kód rezervácie a zobrazte stav transferu.", "Kód rezervácie", "Otvoriť sledovanie"],
    hr: ["Pratite rezervaciju", "Unesite kod rezervacije kako biste vidjeli status transfera.", "Kod rezervacije", "Otvori praćenje"],
  }[locale];
  return <main className="ev-page ev-shell"><div className="ev-card ev-track-card"><div className="ev-eyebrow">Eurosian VIP Transfer</div><h1 className="ev-h1">{copy[0]}</h1><p className="ev-muted">{copy[1]}</p><label className="ev-label" htmlFor="tracking-code">{copy[2]}</label><input id="tracking-code" className="ev-input" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="EVT-1001" /><button className="ev-btn" style={{ marginTop: 14, width: "100%" }} disabled={!code.trim()} onClick={() => router.push(`/takip/${encodeURIComponent(code.trim())}`)}>{copy[3]} →</button></div></main>;
}
