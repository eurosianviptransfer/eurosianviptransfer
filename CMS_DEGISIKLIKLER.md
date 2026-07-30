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

`ContentEntry` ve `SiteSetting` tabloları **şu an yalnızca admin panelinde** kullanılıyor.
Kontrol ettiğimde canlı sitenin (`src/app/[lang]/...`) hiçbir sayfası bu tablolardan veri
okumuyor — metinler, ayarlar ve logo hâlâ komponentlerde sabit (hardcoded). Yani admin panelinde
bir metni değiştirdiğinizde şu anda **sitede görünmez**.

Bunu tam anlamıyla "dinamik" hale getirmek için ikinci bir adım gerekiyor: ilgili genel sayfaların
(`src/app/[lang]/hakkimizda`, `iletisim`, footer, header logo vb.) `prisma.contentEntry` /
`prisma.siteSetting` üzerinden veri okuyacak şekilde güncellenmesi. İsterseniz bunu da yapabilirim —
hangi sayfa/metinlerin öncelikli olduğunu söylemeniz yeterli.

## Kurulum notları

- `npm install` sonrası `npx prisma generate` çalıştırmayı unutmayın (schema ile generate edilmiş
  client bu ortamda senkron değildi, ağ erişimim olmadığı için burada çalıştıramadım).
- Prodüksiyonda gerçek dosya yükleme için `R2_*` ya da `CLOUDINARY_*` ortam değişkenlerini
  ayarlayın; aksi halde yerel geliştirmede `public/media-library` altına yazar (production'da hata
  verir, güvenlik için kasıtlı).
