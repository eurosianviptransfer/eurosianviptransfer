# eurosianviptransfer.com domain geçiş planı

Bu doküman mevcut Vercel projesini canlı domain'e taşımak için hazırlanmıştır. Geçiş sırasında mevcut `eurosianviptransfer.com` adresi çalışır tutulmalı; DNS ve environment değişiklikleri doğrulandıktan sonra yönlendirme yapılmalıdır.

## Geçiş öncesi

- Vercel'de ücretli planı etkinleştir.
- `eurosianviptransfer.com` ve gerekiyorsa `www.eurosianviptransfer.com` domain'lerini Vercel projesine ekle.
- Vercel'in verdiği DNS kayıtlarını domain sağlayıcısında tanımla.
- `APP_URL` ve `NEXTAUTH_URL` değerlerini yeni domain'e çevir:

```text
APP_URL=https://eurosianviptransfer.com
NEXTAUTH_URL=https://eurosianviptransfer.com
```

- `R2_PUBLIC_BASE_URL` değerini gerçek R2 custom domain'i ile tanımla; uygulama bunu fotoğraf URL'si doğrulamasında kullanır.
- Production'da `APP_ENCRYPTION_KEY` değerini değiştirme. Değişirse daha önce saklanan şifreli WhatsApp mesajları çözülemez.

## Dış servis kontrolü

- Google Maps API key HTTP referrer listesine yeni domain'i ekle; eski domain'i geçiş tamamlanana kadar bırak.
- Stripe success/cancel URL ve webhook endpoint'ini kontrol et.
- Meta/Twilio WhatsApp callback veya izinli domain ayarlarını kontrol et.
- R2 custom domain CORS ayarlarında yeni domain'den `PUT` isteğine izin ver.
- Neon, Redis, Pusher ve worker ortamlarında uygulama URL'si gerekiyorsa güncelle.

## Yayın sırası

1. Vercel environment değerlerini Production için güncelle.
2. Domain DNS doğrulamasını tamamla.
3. `vercel --prod --yes` ile deploy et.
4. `https://eurosianviptransfer.com`, `/sofor-basvuru`, `/basvuru-takip`, `/degerlendir` ve `/api/health` kontrol et.
5. Admin login, Stripe dönüşü, başvuru fotoğraf upload ve WhatsApp mesajındaki login URL'sini test et.
6. Eski domain için 301 yönlendirme ekle; eski domain'i hemen kapatma.

## Geri dönüş

Sorun çıkarsa Vercel'de önceki başarılı deployment'ı production'a promote et, DNS'i değiştirme. Environment değişikliğinden önce mevcut Production değerlerini güvenli şekilde kaydet.
