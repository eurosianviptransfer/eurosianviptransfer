import Link from "next/link";
import { MediaUploader } from "@/components/admin/cms/MediaUploader";

export const dynamic = "force-dynamic";

export default function MediaUploadPage() {
  return (
    <>
      <div className="ev-cms-breadcrumb">
        <Link href="/admin/media">Medya</Link> / Yükle
      </div>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Medya Yükle</h1>
          <p>Görseller otomatik olarak medya kütüphanenize eklenir ve sayfa/logo seçiminde kullanılabilir hale gelir.</p>
        </div>
      </div>
      <div className="ev-card">
        <MediaUploader />
        <div className="ev-actions" style={{ marginTop: 18 }}>
          <Link className="ev-btn ev-btn--ghost" href="/admin/media">Medya Kütüphanesine Dön</Link>
        </div>
      </div>
    </>
  );
}
