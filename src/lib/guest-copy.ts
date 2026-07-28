import { messages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export interface BookingCopy {
  title: string;
  airport: string;
  destination: string;
  hotelSearch: string;
  region: string;
  regionLoading: string;
  regionChoose: string;
  selectedAddress: string;
  addressPlaceholder: string;
  mapsNote: string;
  name: string;
  phone: string;
  email: string;
  passengers: string;
  flight: string;
  vehicleSmall: string;
  vehicleLarge: string;
  returnTrip: string;
  payVehicle: string;
  payCard: string;
  total: string;
  confirm: string;
  required: string;
  destinationRequired: string;
  regionRequired: string;
  addressRequired: string;
  estimate: string;
  searchButton: string;
  searchExample: string;
  searchError: string;
  googleApiRequired: string;
  loadingAddresses: string;
  selectedAddressPrefix: string;
}

const tr: BookingCopy = {
  title: "Havalimanı Transferi Rezervasyonu", airport: "Kalkış havalimanı", destination: "Varış — Otel / Adres", hotelSearch: "Otel veya adres ara", region: "Bölge", regionLoading: "Bölge yükleniyor…", regionChoose: "Bölge seçin", selectedAddress: "Seçilen otel/adres", addressPlaceholder: "Arama sonucu veya manuel giriş", mapsNote: "Google Places anahtarı tanımlı değil. Bölge seçerek devam edebilirsiniz.", name: "Ad Soyad", phone: "WhatsApp Telefon", email: "E-posta (opsiyonel)", passengers: "Yolcu Sayısı", flight: "Uçuş No (opsiyonel)", vehicleSmall: "Vito / Transporter (küçük)", vehicleLarge: "Sprinter (büyük)", returnTrip: "Dönüş transferi ekle", payVehicle: "Araçta Öde", payCard: "Şimdi Öde (Kart)", total: "Toplam Fiyat", confirm: "Rezervasyonu Onayla", required: "Ad, telefon ve tarih gerekli.", destinationRequired: "Varış adresi gerekli.", regionRequired: "Bölge seçimi gerekli.", addressRequired: "Otel veya adres bilgisi gerekli.", estimate: "Tahmini fiyat",
  searchButton: "Ara",
  searchExample: "Örn. Lara Beach Hotel",
  searchError: "Arama başarısız.",
  googleApiRequired: "Google adres araması için API anahtarı gerekiyor",
  loadingAddresses: "Adres araması yükleniyor…",
  selectedAddressPrefix: "Seçilen konum:",
};

const en: BookingCopy = { title: "Airport Transfer Booking", airport: "Pickup airport", destination: "Destination — Hotel / Address", hotelSearch: "Search hotel or address", region: "Area", regionLoading: "Loading areas…", regionChoose: "Choose an area", selectedAddress: "Selected hotel/address", addressPlaceholder: "Search result or manual entry", mapsNote: "Google Places is not configured. You can continue by selecting an area.", name: "Full name", phone: "WhatsApp phone", email: "Email (optional)", passengers: "Passengers", flight: "Flight No. (optional)", vehicleSmall: "Vito / Transporter (small)", vehicleLarge: "Sprinter (large)", returnTrip: "Add return transfer", payVehicle: "Pay in vehicle", payCard: "Pay now (card)", total: "Total price", confirm: "Confirm booking", required: "Name, phone and date are required.", destinationRequired: "Destination address is required.", regionRequired: "Please choose an area.", addressRequired: "Hotel or address details are required.", estimate: "Estimated price", searchButton: "Search", searchExample: "e.g. Lara Beach Hotel", searchError: "Search failed." };
en.googleApiRequired = "Google address search requires an API key";
en.loadingAddresses = "Address search loading…";
en.selectedAddressPrefix = "Selected location:";
const de: BookingCopy = { title: "Flughafentransfer buchen", airport: "Abholflughafen", destination: "Ziel — Hotel / Adresse", hotelSearch: "Hotel oder Adresse suchen", region: "Region", regionLoading: "Regionen werden geladen…", regionChoose: "Region wählen", selectedAddress: "Ausgewähltes Hotel/Adresse", addressPlaceholder: "Suchergebnis oder manuelle Eingabe", mapsNote: "Google Places ist nicht konfiguriert. Sie können eine Region auswählen.", name: "Name", phone: "WhatsApp-Telefon", email: "E-Mail (optional)", passengers: "Passagiere", flight: "Flugnummer (optional)", vehicleSmall: "Vito / Transporter (klein)", vehicleLarge: "Sprinter (groß)", returnTrip: "Rücktransfer hinzufügen", payVehicle: "Im Fahrzeug zahlen", payCard: "Jetzt zahlen (Karte)", total: "Gesamtpreis", confirm: "Buchung bestätigen", required: "Name, Telefon und Datum sind erforderlich.", destinationRequired: "Zieladresse ist erforderlich.", regionRequired: "Bitte wählen Sie eine Region.", addressRequired: "Hotel- oder Adressdaten sind erforderlich.", estimate: "Geschätzter Preis", searchButton: "Suchen", searchExample: "z. B. Lara Beach Hotel", searchError: "Suche fehlgeschlagen." };
const es: BookingCopy = { ...en, title: "Reserva de traslado desde el aeropuerto", airport: "Aeropuerto de salida", destination: "Destino — Hotel / Dirección", hotelSearch: "Buscar hotel o dirección", region: "Zona", regionChoose: "Elija una zona", selectedAddress: "Hotel/dirección seleccionada", name: "Nombre completo", phone: "Teléfono de WhatsApp", passengers: "Pasajeros", returnTrip: "Añadir traslado de vuelta", payVehicle: "Pagar en el vehículo", payCard: "Pagar ahora (tarjeta)", total: "Precio total", confirm: "Confirmar reserva", required: "El nombre, teléfono y fecha son obligatorios.", destinationRequired: "La dirección de destino es obligatoria.", regionRequired: "Elija una zona.", addressRequired: "Indique el hotel o la dirección." };
const it: BookingCopy = { ...en, title: "Prenotazione transfer aeroportuale", airport: "Aeroporto di partenza", destination: "Destinazione — Hotel / Indirizzo", hotelSearch: "Cerca hotel o indirizzo", region: "Zona", regionChoose: "Scegli una zona", selectedAddress: "Hotel/indirizzo selezionato", name: "Nome e cognome", phone: "Telefono WhatsApp", passengers: "Passeggeri", returnTrip: "Aggiungi transfer di ritorno", payVehicle: "Paga a bordo", payCard: "Paga ora (carta)", total: "Prezzo totale", confirm: "Conferma prenotazione", required: "Nome, telefono e data sono obbligatori.", destinationRequired: "L'indirizzo di destinazione è obbligatorio.", regionRequired: "Scegli una zona.", addressRequired: "Inserisci hotel o indirizzo." };
const fr: BookingCopy = { ...en, title: "Réserver un transfert aéroport", airport: "Aéroport de départ", destination: "Destination — Hôtel / Adresse", hotelSearch: "Rechercher un hôtel ou une adresse", region: "Région", regionChoose: "Choisir une région", selectedAddress: "Hôtel/adresse sélectionné(e)", name: "Nom complet", phone: "Téléphone WhatsApp", passengers: "Passagers", returnTrip: "Ajouter le trajet retour", payVehicle: "Payer dans le véhicule", payCard: "Payer maintenant (carte)", total: "Prix total", confirm: "Confirmer la réservation", required: "Le nom, le téléphone et la date sont requis.", destinationRequired: "L'adresse de destination est requise.", regionRequired: "Choisissez une région.", addressRequired: "Indiquez l'hôtel ou l'adresse." };
const ru: BookingCopy = { ...en, title: "Бронирование трансфера из аэропорта", airport: "Аэропорт отправления", destination: "Пункт назначения — отель / адрес", hotelSearch: "Поиск отеля или адреса", region: "Район", regionChoose: "Выберите район", selectedAddress: "Выбранный отель/адрес", name: "Имя и фамилия", phone: "Телефон WhatsApp", passengers: "Пассажиры", returnTrip: "Добавить обратный трансфер", payVehicle: "Оплата в автомобиле", payCard: "Оплатить сейчас (карта)", total: "Итоговая цена", confirm: "Подтвердить бронирование", required: "Необходимо указать имя, телефон и дату.", destinationRequired: "Необходимо указать адрес назначения.", regionRequired: "Выберите район.", addressRequired: "Укажите отель или адрес." };
const ar: BookingCopy = { ...en, title: "حجز النقل من المطار", airport: "مطار الانطلاق", destination: "الوجهة — الفندق / العنوان", hotelSearch: "ابحث عن فندق أو عنوان", region: "المنطقة", regionChoose: "اختر المنطقة", selectedAddress: "الفندق/العنوان المحدد", name: "الاسم الكامل", phone: "هاتف واتساب", passengers: "المسافرون", returnTrip: "إضافة رحلة العودة", payVehicle: "الدفع في السيارة", payCard: "الدفع الآن (بطاقة)", total: "السعر الإجمالي", confirm: "تأكيد الحجز", required: "الاسم والهاتف والتاريخ مطلوبة.", destinationRequired: "عنوان الوجهة مطلوب.", regionRequired: "يرجى اختيار المنطقة.", addressRequired: "يرجى إدخال الفندق أو العنوان." };
const zh: BookingCopy = { ...en, title: "机场接送预订", airport: "出发机场", destination: "目的地 — 酒店 / 地址", hotelSearch: "搜索酒店或地址", region: "区域", regionChoose: "选择区域", selectedAddress: "已选酒店/地址", name: "姓名", phone: "WhatsApp 电话", passengers: "乘客", returnTrip: "添加返程接送", payVehicle: "上车付款", payCard: "立即付款（银行卡）", total: "总价", confirm: "确认预订", required: "姓名、电话和日期为必填项。", destinationRequired: "目的地地址为必填项。", regionRequired: "请选择区域。", addressRequired: "请输入酒店或地址。" };
const ja: BookingCopy = { ...en, title: "空港送迎の予約", airport: "出発空港", destination: "目的地 — ホテル / 住所", hotelSearch: "ホテルまたは住所を検索", region: "エリア", regionChoose: "エリアを選択", selectedAddress: "選択したホテル/住所", name: "氏名", phone: "WhatsApp 電話番号", passengers: "乗車人数", returnTrip: "復路送迎を追加", payVehicle: "車内で支払う", payCard: "今すぐ支払う（カード）", total: "合計金額", confirm: "予約を確定", required: "氏名、電話番号、日付は必須です。", destinationRequired: "目的地の住所が必要です。", regionRequired: "エリアを選択してください。", addressRequired: "ホテルまたは住所を入力してください。" };

const copies: Partial<Record<Locale, BookingCopy>> = { tr, en, de, es, it, fr, ru, ar, zh, ja };

function buildFallbackBookingCopy(locale: Locale): BookingCopy {
  const localized = messages[locale] ?? messages.en;
  return {
    ...en,
    title: localized.title,
    airport: localized.from,
    destination: localized.to,
    hotelSearch: localized.toPlaceholder,
    passengers: localized.guests,
  };
}

export function getBookingCopy(locale: Locale) {
  return copies[locale] ?? buildFallbackBookingCopy(locale);
}
