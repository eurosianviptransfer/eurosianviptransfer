# Eurosian VIP Transfer — Operasyon Platformu

Canlı domain geçişi için [domain cutover planına](docs/domain-cutover-eurosian.md) bakın.

Şartnameye (`transfer-platform-sistem-promptu.md`) göre kurulmuş tam proje iskeleti.

## Kapsam

- **`prisma/schema.prisma`** — tam veri modeli: `Booking`, `Vehicle`, `User` (rol bazlı),
  `PricingRule`, `PayoutRule`, `Payout`, `BookingStatusEvent`, belge/bakım takibi, Faz 3
  için hazır `BookingSource` alanı.
- **`src/lib/pricing/engine.ts`** + **`resolve-by-distance.ts`** — saf fiyatlandırma
  fonksiyonları; km, PricingRule tablosuyla eşleşmezse iki bölge arası doğrusal
  interpolasyonla tahmini fiyat üretir (`isEstimate: true`).
- **`src/lib/booking/rules.ts`** — küçük araç → karşılamacı zorunlu iş kuralı, durum makinesi.
- **`src/lib/providers/`** — sağlayıcıdan bağımsız adapter katmanı: `payment` (Stripe/Airtm),
  `whatsapp` (Twilio/Meta), `translation` (Google/DeepL), `flight` (AviationStack),
  `maps` (Google Distance Matrix).
- **`src/lib/auth/`** — Auth.js: admin email/şifre (bcrypt) + şoför/karşılamacı telefon+şifre.
  Personel şifreleri seed sırasında yalnızca yeni hesap oluşturulurken atanır; mevcut hesapların
  şifreleri tekrar seed ile resetlenmez.
- **`src/lib/realtime/pusher-server.ts`** + **`BookingRealtimeListener.tsx`** — her durum
  değişikliği yayınlanır, misafirin takip sayfası otomatik yenilenir.
- **`src/lib/queue/`** — BullMQ: WhatsApp gönderimi ve çeviri+bildirim kuyruğa alınır,
  ayrı bir worker process'te (`npm run worker`) işlenir; API isteklerini bloklamaz.
- **`src/components/AddressAutocomplete.tsx`** — Google Places `PlaceAutocompleteElement`.
- **`src/app/`** — çalışan sayfalar: `/admin`, `/admin/fiyatlar`, `/sofor`,
  `/karsilamaci`, `/rezervasyon`, `/takip/[code]` — hepsi `src/app/globals.css`'teki
  "Mediterranean dusk" tasarım token'larını (demo/App.jsx ile aynı palet) kullanıyor.
- **`src/proxy.ts`** — Next.js 16'nın `middleware.ts` yerine geçen `proxy.ts` kuralına göre
  yazıldı (rol bazlı route koruması, aynı mantık, sadece dosya/export adı değişti).
- **`src/app/page.tsx`** — ana sayfa (`/`): misafir için rezervasyon linki, ekip için
  `/giris` hub'ına link.
- **Giriş sayfaları:** her rolün kendi ekranı var — `/admin/giris` (email+şifre),
  `/sofor/giris` ve `/karsilamaci/giris` (telefon+OTP, `expectedRole` ile birbirine
  karışmaz — bir şoför karşılamacı ekranından giriş yapamaz). `/giris` sadece rol
  seçim sayfası (hub). Her koruma altı sayfa girişsizse otomatik kendi giriş
  ekranına yönlenir (`src/middleware.ts`).
- **`prisma/seed.ts`** — `ADMIN_DEFAULT_PASSWORD` secret'ı ile admin, 3 şoför + 2
  karşılamacı, 3 araç ve bölge fiyat kuralları oluşturur. Saha kullanıcıları OTP ile giriş yapar.

## Kurulum (kendi makinenizde veya Vercel'de)

```bash
npm install
cp .env.example .env   # değerleri doldurun
npx prisma migrate dev
npm run db:seed
npm run dev
```

Production'da migration için `npx prisma migrate deploy` kullanın ve seed öncesinde
`ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_DEFAULT_PASSWORD` ve en az 12 karakterlik
`STAFF_DEFAULT_PASSWORD` secret/config değerlerini tanımlayın. Seed mevcut hesapların şifresini
değiştirmez. Kart ödemeleri için Stripe Dashboard'da
`/api/payments/stripe/webhook` endpoint'ini `checkout.session.completed` ve
`checkout.session.expired` olaylarıyla yapılandırın.

Worker'ı (WhatsApp/çeviri gönderimi için) ayrı bir servis olarak çalıştırın:
```bash
npm run worker
```
Worker health endpoint'i `WORKER_HEALTH_PORT` üzerinde `/health` ve `/healthz` yollarında
çalışır. `Dockerfile.worker` Railway/Render/VPS gibi sürekli çalışan Node servislerinde
kullanılabilir. Deploy sırasında `DATABASE_URL`, `REDIS_URL`, WhatsApp/çeviri secret'ları ve
`WORKER_HEALTH_PORT` tanımlanmalıdır; health check `/health` olmalıdır.

## Neden bu ortamda "npm install" çalıştırılamıyor

Bu proje bir sandbox konteynerde hazırlandı — dışa internet erişimi kapalı, yani
`npm install` burada çalışamaz. Bunun yerine mantığı iki şekilde doğruladım:

1. **`npm run test:smoke`** — Node'un built-in test runner'ı (`node:test`) ve TypeScript
   stripping özelliğini (Node 22.6+) kullanır, `npm install` GEREKTİRMEZ. `src/lib/`
   altındaki gerçek fiyatlandırma/kural/OTP mantığını birim test eder ve
   `runnable/server.js`'i fiilen başlatıp gerçek admin/şoför/karşılamacı girişleriyle
   onay→atama→karşıla→teslim→tamamla akışını uçtan uca doğrular (girişsiz erişim,
   yanlış şifre/PIN ve yanlış kişiye atanmış işe erişim denemeleri de dahil).
   **39/39 test geçti** (bu ortamda çalıştırıp doğruladım).
2. **`tsc --noEmit --noResolve`** ile tüm `.tsx` sayfaları JSX dahil sözdizimi
   açısından kontrol edildi — sıfır hata (modül bulunamadı hataları, `npm install`
   yapılmadığı için beklenen ve filtrelendi).

`npm test` (vitest, aynı testlerin tam sürümü) ve gerçek `npm run dev` için `npm install`
gerekiyor — o adımı sizin çalıştırmanız gerekiyor.

## Dış sağlayıcı kurulumu

- Meta WhatsApp worker'ı `WHATSAPP_PROVIDER="meta"` ile seçilir. Meta WhatsApp Manager'da
  onaylanan şablon adları `WHATSAPP_TEMPLATE_*` değişkenlerine yazılmalı; gövde değişken sırası
  `src/lib/providers/whatsapp/templates.ts` ile aynı olmalıdır.
- Airtm Enterprise API v2 için `AIRTM_API_KEY`, `AIRTM_API_SECRET`, `AIRTM_API_BASE_URL` ve
  `AIRTM_CHECKOUT_URL_TEMPLATE` doldurulmalıdır. Airtm pay-in API USD/USDC kullandığından EUR
  rezervasyon tutarı kur dönüşümü uygulanmadan gönderilmez.
- `PayoutRule` — admin `/admin/fiyatlar` sayfasından araç tipi bazlı önerilen şoför/karşılamacı
  ücretini düzenleyebiliyor; bu artık atama formunda varsayılan değer olarak geliyor.

## Dağıtım mimarisi notu

Next.js uygulaması Vercel'de serverless çalışır. BullMQ worker'ı SÜREKLİ çalışan bir
process'tir — Vercel bunu barındıramaz. `Dockerfile.worker` ile ayrı bir küçük servis
(Railway/Render'ın worker servisi veya VPS/pm2) 7/24 ayakta tutulmalı; ikisi de aynı
`REDIS_URL`'e (Upstash) bağlanır. Vercel uygulaması için `/api/health` DB bağlantısını
kontrol eder. Public quote/search/booking/tracking uçlarında Redis tabanlı rate limit ve
kısa süreli cache vardır; Redis yoksa yalnızca geliştirme amaçlı bellek fallback'i kullanılır.

## Faz planı

Şartname Bölüm 14'teki sırayı takip eder: Faz 1 (temel akış + Twilio + sabit bölge
listesi) → Faz 2 (Google Maps + otomatik çeviri + Stripe/Airtm + hakediş raporlama,
bu iskelette tamamlandı) → Faz 3 (Meta WhatsApp'a geçiş, iyzico, çoklu havalimanı,
gerekirse React Native).
