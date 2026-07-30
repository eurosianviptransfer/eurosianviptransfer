# CMS Admin Paneli Güncellemesi

Bu güncelleme `/admin/cms`, `/admin/content`, `/admin/media`, `/admin/settings` alanlarını kapsar.

## Neler değişti

1. **Ortak modern layout** — Dört sayfa artık `src/app/admin/(cms)/layout.tsx` altında paylaşılan bir
   sidebar navigasyona sahip (Genel Bakış / Sayfalar / Medya / Ayarlar + tema geçişi + operasyon
   paneline dönüş). Route group (`(cms)`) URL'leri değiştirmez.
2. **Bug fix:** `api/admin/content/[id]` ve `api/admin/media/[id]` route'ları Next.js 16'nın async
   `params` API'sini yanlış okuyordu (`(req as any).params`), bu yüzden düzenleme/silme aslında
   çalışmıyordu. Düzeltildi.
3. **Eksik sayfalar tamamlandı:**
   - `/admin/content/new`, `/admin/content/[id]` — içerik oluşturma/düzenleme formu
   - `/admin/settings/new`, `/admin/settings/[id]` — ayar oluşturma/düzenleme formu
   - `/admin/media/upload` — sürükle-bırak dosya yükleme
4. **Eksik API tamamlandı:** `api/admin/settings` (GET/POST, upsert) ve `api/admin/settings/[id]`
   (GET/PATCH/DELETE) sıfırdan yazıldı — önceden site ayarları için oluşturma/güncelleme API'si yoktu.
5. **Gerçek medya yükleme akışı:** `api/uploads/media` — Cloudinary (signed/unsigned), Cloudflare R2
   veya yerel dev fallback (`public/media-library/...`) zincirini kullanır (mevcut
   `vehicle-image` yükleme deseniyle aynı mantık). Önceden medya kaydı sadece harici bir URL
   yapıştırılarak yapılabiliyordu.
6. **Logo yönetimi:** Ayarlar sayfasının üstünde `LogoPicker` bileşeni — mevcut logoyu gösterir,
   medya kütüphanesinden seçim yapmayı veya yeni bir dosya yüklemeyi sağlar. Seçilen logo
   `SiteSetting` tablosunda `branding.logo` anahtarıyla `{ "url": "..." }` olarak saklanır.
7. **Görsel tasarım:** `globals.css`'e CMS'e özel sınıflar eklendi (`ev-cms-*`, `ev-stat-*`,
   `ev-media-*`, `ev-dropzone`, `ev-logo-*`, `.ev-btn--danger` eksikti, o da eklendi) — mevcut
   dark/light tema token'larınızla uyumlu.

## ÖNEMLİ — henüz yapılmayan kısım

Bir sonraki güncellemeyle **logo, ana sayfa SEO şeması, Hakkımızda ve İletişim sayfaları** artık
gerçekten CMS'den okuyor (aşağıya bakın). Ancak site genelinde onlarca SEO/iniş sayfası
(fiyatlar, filomuz, havalimanı transferi, şehirlerarası transfer, medikal transfer, kurumsal) ve
20+ dilli ana sayfa footer/nav metinleri (`src/lib/i18n.ts`) hâlâ koda gömülü. Bunlar çok büyük,
tek dosyada binlerce satırlık bir çeviri sözlüğüne dayanıyor — güvenli şekilde CMS'e taşımak
ayrı, kapsamlı bir iş. İsterseniz öncelik sırasına göre (örn. önce fiyat sayfası, sonra filo
sayfaları) adım adım devam edebilirim.

## Canlı siteye CMS bağlantısı (güncelleme 3)

- **Logo:** Ana sayfa header'ı ve SEO JSON-LD şeması artık `/admin/settings` üzerinden
  yönetilen logoyu okuyor (`src/lib/cms/read.ts` → `getSiteLogoUrl()`). CMS'te bir logo
  seçilmemişse `public/eurosianviptransferlogo.png` dosyasına düşer.
  **Not:** `public/logo.png` dosyası artık diskte yoktu (muhtemelen sizin tarafınızda silindi),
  bu yüzden ana sayfanın header logosu **kırıktı** — bu değişiklik aynı zamanda o hatayı da
  düzeltiyor.
- **Hakkımızda** (`/[lang]/hakkimizda`) ve **İletişim** (`/[lang]/iletisim`) sayfalarındaki
  başlık ve gövde metni artık `/admin/content` üzerinden yönetilebilir: sırasıyla
  `key="hakkimizda"` ve `key="iletisim"` ile, ilgili dilde (`tr`/`en`/`de`/`ru`) bir içerik
  oluşturup **yayına alırsanız (published)**, sitedeki sabit metnin yerine o kullanılır.
  Yayınlanmış bir kayıt yoksa mevcut sabit metin fallback olarak kalır — hiçbir şey kırılmaz.
- Bu sayfalar `revalidate = 300` ile işaretlendi: admin panelinde yaptığınız bir değişiklik,
  yeniden deploy gerekmeden en geç 5 dakika içinde canlıya yansır.
- Ana sayfadaki logo artık `next/image` yerine düz `<img>` ile render ediliyor — çünkü logo
  URL'i artık admin panelinden herhangi bir depolama sağlayıcısından (R2/Cloudinary/yerel)
  gelebilir ve `next/image`'ın `remotePatterns` beyaz listesinde olmayan bir domain tüm sayfanın
  hata vermesine yol açabilirdi.

## Kurulum notları

- `npm install` sonrası `npx prisma generate` çalıştırmayı unutmayın (schema ile generate edilmiş
  client bu ortamda senkron değildi, ağ erişimim olmadığı için burada çalıştıramadım).
- Prodüksiyonda gerçek dosya yükleme için `R2_*` ya da `CLOUDINARY_*` ortam değişkenlerini
  ayarlayın; aksi halde yerel geliştirmede `public/media-library` altına yazar (production'da hata
  verir, güvenlik için kasıtlı).
