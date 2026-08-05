import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function MediaListPage() {
  let items: Array<{ id: string; url: string; filename: string }> = [];
  let error: string | null = null;
  try {
    items = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Media</h1>
        <Link href="/admin-revamp/media/upload" className="btn btn-primary">Upload</Link>
      </div>

      {error && <div className="alert alert-warning">Media index unavailable: {error}</div>}

      <div className="row g-3">
        {items.length === 0 && <div className="col-12">No media</div>}
        {items.map((m) => (
          <div key={m.id} className="col-3">
            <div className="card">
              <img src={m.url} className="card-img-top" alt={m.filename} style={{ maxHeight: 160, objectFit: "cover" }} />
              <div className="card-body p-2">
                <div className="small text-truncate">{m.filename}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
