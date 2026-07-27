# Çalışan Backend + Gerçek Giriş (sıfır bağımlılık)

Bu klasördeki `server.js` + `index.html`, npm install GEREKTİRMEZ — sadece
Node.js'in built-in modüllerini kullanır (http, crypto, fs). Gerçek fiyatlandırma
motoru, karşılamacı-zorunluluğu kuralı, durum makinesi, çakışma kontrolü VE
**gerçek giriş zorunluluğu** burada fiilen çalışır.

## Giriş kuralı

- **Misafir:** giriş GEREKMEZ — rezervasyon oluşturma ve kod ile takip herkese açık.
- **Admin, Şoför, Karşılamacı:** HİÇBİR aksiyon (onay, atama, teslim al/bırak,
  karşıla/teslim et, tamamla) geçerli bir oturum olmadan çalışmaz — sunucu
  tarafında zorlanır (401 döner). Şifre/PIN'ler scrypt ile hash'lenmiş, tuzlu;
  düz metin hiçbir yerde saklanmaz.

## Çalıştırma

```bash
node server.js
```

Tarayıcıda: **http://localhost:4000**

## İlk kurulum giriş bilgileri (seed)

| Rol | Kullanıcı adı / Telefon | Şifre / PIN |
|---|---|---|
| Admin | `admin` | `Eurosian2026!` |
| Şoför | `+905551110001` (Emre) | `1234` |
| Şoför | `+905551110002` (Caner) | `1234` |
| Şoför | `+905551110003` (Hakan) | `1234` |
| Karşılamacı | `+905551110011` (Aylin) | `1234` |
| Karşılamacı | `+905551110012` (Deniz) | `1234` |

Sunucu ilk çalıştığında bu bilgileri terminale de yazdırır.

## Kalıcı veri

İlk çalıştırmada `data.json` otomatik oluşturulur ve her değişiklikte
güncellenir. Sunucuyu durdurup yeniden başlattığında rezervasyonlar,
kullanıcılar, hakedişler KAYBOLMAZ. Sıfırdan başlamak istersen `data.json`'ı
silip sunucuyu yeniden başlat — seed verisi tekrar oluşturulur.

## Test edilen senaryo (bu paketle birlikte doğrulandı)

1. Misafir → Side bölgesine küçük araçla rezervasyon (giriş gerekmeden)
2. Admin girişi → onay → **karşılamacısız atama denemesi reddedildi** (küçük
   araçta zorunlu) → karşılamacılı atama başarılı
3. Karşılamacı girişi → misafiri karşıladı → şoföre teslim etti
4. Şoför girişi → otele bıraktı
5. Admin → tamamladı → 2 hakediş kaydı oluştu (şoför + karşılamacı)

## Bunun sınırı

Gerçek Postgres/Prisma/Stripe/WhatsApp içermez — proje kökündeki `src/`
klasöründeki Next.js iskeleti prodüksiyon entegrasyonları için. Bu klasör,
iş mantığının ve giriş/yetkilendirmenin gerçekten çalıştığını göstermek için
bağımsız, kendi kendine yeten bir sürüm.
