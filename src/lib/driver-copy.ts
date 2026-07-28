export interface DriverCopy {
  eyebrow: string;
  title: string;
  description: string;
  trackingEyebrow: string;
  trackingTitle: string;
  applicationNoLabel: string;
  phoneLabel: string;
  placeholderApplicationNo: string;
  placeholderPhone: string;
  trackingButton: string;
  trackingLoading: string;
  statusLabels: Record<string, string>;
  rejectionPrefix: string;
  approvedNote: string;
  lastUpdatedPrefix: string;
  // Form labels and buttons
  sectionPersonal: string;
  sectionVehicle: string;
  labelFullName: string;
  labelPhone: string;
  labelEmail: string;
  labelAddress: string;
  labelLicense: string;
  labelVehiclePlate: string;
  labelVehicleModel: string;
  labelVehicleYear: string;
  labelVehicleSize: string;
  vehicleOptionSmall: string;
  vehicleOptionLarge: string;
  labelPassengerCapacity: string;
  labelLuggageCapacity: string;
  labelFeatures: string;
  labelPhotos: string;
  submitButton: string;
  submitLoading: string;
  submittedEyebrow: string;
  submittedTitlePrefix: string;
  submittedNote: string;
  followButton: string;
  imageUploadUrlError: string;
  imageUploadError: string;
  applicationSubmitError: string;
}

const tr: DriverCopy = {
  eyebrow: "Eurosian VIP Transfer · Partner ağı",
  title: "Şoför / araç başvurusu",
  description: "Bilgilerinizi gönderin. Başvurunuz admin incelemesine düşer; başvuru numaranız ve telefonunuzla durumunuzu istediğiniz zaman takip edebilirsiniz.",
  trackingEyebrow: "Başvuru takip",
  trackingTitle: "Başvurunuzun durumu",
  applicationNoLabel: "Başvuru numarası",
  phoneLabel: "Başvuruda kullandığınız telefon",
  placeholderApplicationNo: "EVT-SOF-1234",
  placeholderPhone: "+90 5xx xxx xx xx",
  trackingButton: "Durumu sorgula",
  trackingLoading: "Sorgulanıyor…",
  statusLabels: { PENDING: "Admin onayında bekliyor", APPROVED: "Onaylandı", REJECTED: "Reddedildi" },
  rejectionPrefix: "Red nedeni:",
  approvedNote: "Giriş bilgileriniz admin tarafından WhatsApp üzerinden iletilecektir.",
  lastUpdatedPrefix: "Son güncelleme:",
  sectionPersonal: "Kişisel bilgiler",
  sectionVehicle: "Araç bilgileri",
  labelFullName: "Ad soyad",
  labelPhone: "Telefon",
  labelEmail: "E-posta",
  labelAddress: "Adres / ikamet",
  labelLicense: "Ehliyet / belge no",
  labelVehiclePlate: "Plaka",
  labelVehicleModel: "Marka / model",
  labelVehicleYear: "Model yılı",
  labelVehicleSize: "Araç sınıfı",
  vehicleOptionSmall: "Vito / Transporter / VIP araç",
  vehicleOptionLarge: "Sprinter / minibüs / otobüs",
  labelPassengerCapacity: "Yolcu kapasitesi",
  labelLuggageCapacity: "Bagaj kapasitesi",
  labelFeatures: "Özellikler (virgülle ayırın)",
  labelPhotos: "Araç fotoğrafları (en fazla 3)",
  submitButton: "Başvuruyu gönder",
  submitLoading: "Gönderiliyor…",
  submittedEyebrow: "Başvurunuz alındı",
  submittedTitlePrefix: "Takip numaranız:",
  submittedNote: "Başvurunuz admin onayına gönderildi. Durumunuzu bu numara ve telefonunuzla takip edebilirsiniz.",
  followButton: "Başvuruyu takip et",
  imageUploadUrlError: "Görüntü yükleme URL'si alınamadı.",
  imageUploadError: "Görüntü depolamaya yüklenemedi.",
  applicationSubmitError: "Başvuru gönderilemedi. Lütfen bilgilerinizi kontrol edin.",
};

const en: DriverCopy = {
  eyebrow: "Eurosian VIP Transfer · Partner network",
  title: "Driver / Vehicle Application",
  description: "Submit your details. Your application will be reviewed by our admin team; you can track status using your application number and phone.",
  trackingEyebrow: "Application tracking",
  trackingTitle: "Track your application",
  applicationNoLabel: "Application number",
  phoneLabel: "Phone used in application",
  placeholderApplicationNo: "EVT-DRV-1234",
  placeholderPhone: "+90 5xx xxx xx xx",
  trackingButton: "Check status",
  trackingLoading: "Checking…",
  statusLabels: { PENDING: "Pending admin review", APPROVED: "Approved", REJECTED: "Rejected" },
  rejectionPrefix: "Rejection reason:",
  approvedNote: "Your login details will be sent via WhatsApp once approved.",
  lastUpdatedPrefix: "Last updated:",
  sectionPersonal: "Personal information",
  sectionVehicle: "Vehicle information",
  labelFullName: "Full name",
  labelPhone: "Phone",
  labelEmail: "Email",
  labelAddress: "Address / residence",
  labelLicense: "Driving license / document no",
  labelVehiclePlate: "Plate",
  labelVehicleModel: "Make / model",
  labelVehicleYear: "Model year",
  labelVehicleSize: "Vehicle class",
  vehicleOptionSmall: "Vito / Transporter / VIP car",
  vehicleOptionLarge: "Sprinter / minibus / coach",
  labelPassengerCapacity: "Passenger capacity",
  labelLuggageCapacity: "Luggage capacity",
  labelFeatures: "Features (comma separated)",
  labelPhotos: "Vehicle photos (up to 3)",
  submitButton: "Submit application",
  submitLoading: "Submitting…",
  submittedEyebrow: "Application received",
  submittedTitlePrefix: "Your tracking number:",
  submittedNote: "Your application has been submitted for admin review. Track status with this number and your phone.",
  followButton: "Track application",
  imageUploadUrlError: "Image upload URL could not be retrieved.",
  imageUploadError: "Image could not be uploaded to storage.",
  applicationSubmitError: "Application could not be submitted. Please check your details.",
};

const copies: Record<string, DriverCopy> = { tr, en };

export function getDriverCopy(locale: string) {
  return copies[locale] ?? copies[locale.split("-")[0]] ?? en;
}
