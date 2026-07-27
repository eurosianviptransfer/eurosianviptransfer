import Link from "next/link";

/**
 * Genel giriş noktası — rol seçimi. Doğrudan link paylaşılacaksa
 * /admin/giris, /sofor/giris veya /karsilamaci/giris kullanılmalı;
 * bu sayfa sadece "hangi rol olduğumu bilmiyorum" durumundaki kullanıcı için.
 */
export default function GirisHubPage() {
  return (
    <main className="ev-page">
      <div className="ev-eyebrow">Eurosian VIP Transfer · Ekip</div>
      <h1 className="ev-h1" style={{ marginTop: 10 }}>Çalışma alanınızı seçin</h1>
      <p className="ev-muted" style={{ margin: "8px 0 24px" }}>Size tanımlı rolün giriş ekranından devam edin.</p>
      <div className="ev-grid ev-grid--3">
        <Link href="/admin/giris" className="ev-card ev-link-card" style={{ display: "block", textDecoration: "none" }}>
          <div className="ev-eyebrow">Operasyon</div><h2 style={{ margin: "8px 0 6px", fontSize: 20 }}>Admin</h2>
          <div className="ev-kpi-label">Rezervasyon, filo ve fiyat yönetimi</div>
        </Link>
        <Link href="/sofor/giris" className="ev-card ev-link-card" style={{ display: "block", textDecoration: "none" }}>
          <div className="ev-eyebrow">Saha</div><h2 style={{ margin: "8px 0 6px", fontSize: 20 }}>Şoför</h2>
          <div className="ev-kpi-label">Atanan işler ve transfer durumu</div>
        </Link>
        <Link href="/karsilamaci/giris" className="ev-card ev-link-card" style={{ display: "block", textDecoration: "none" }}>
          <div className="ev-eyebrow">Saha</div><h2 style={{ margin: "8px 0 6px", fontSize: 20 }}>Karşılamacı</h2>
          <div className="ev-kpi-label">Karşılama ve şoföre teslim akışı</div>
        </Link>
      </div>
    </main>
  );
}
