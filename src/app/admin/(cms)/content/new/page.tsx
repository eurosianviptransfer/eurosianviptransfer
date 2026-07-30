import Link from "next/link";
import { ContentForm } from "@/components/admin/cms/ContentForm";

export const dynamic = "force-dynamic";

export default function NewContentPage() {
  return (
    <>
      <div className="ev-cms-breadcrumb">
        <Link href="/admin/content">İçerikler</Link> / Yeni içerik
      </div>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Yeni İçerik</h1>
          <p>Bir sayfa, statik metin, banner veya bölüm içeriği oluşturun.</p>
        </div>
      </div>
      <ContentForm />
    </>
  );
}
