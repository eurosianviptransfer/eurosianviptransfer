import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function MediaListPage() {
  let items: Array<{ id: string; url: string; filename: string }> = [];
  let error: string | null = null;

  try {
    const rawItems = await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    items = rawItems.map((item) => ({
      id: item.id,
      url: item.url,
      filename: item.filename,
    }));
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Media Library</h1>
          <p className="text-muted mb-0">Browse uploaded assets and add new media for page content.</p>
        </div>
        <Link href="/admin-revamp/media/upload" className="btn btn-primary btn-sm px-4">
          Upload Media
        </Link>
      </div>

      {error && <div className="alert alert-warning">Media index unavailable: {error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-3 gap-3">
            <div>
              <h5 className="mb-1">{items.length} assets</h5>
              <p className="text-muted mb-0">Latest uploads are shown first.</p>
            </div>
            <div className="input-group" style={{ maxWidth: 320 }}>
              <span className="input-group-text bg-white border-end-0">🔎</span>
              <input type="search" className="form-control border-start-0" placeholder="Search media" disabled />
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-5 text-muted">No media assets found.</div>
          ) : (
            <div className="row g-3">
              {items.map((m) => (
                <div key={m.id} className="col-6 col-sm-4 col-lg-3">
                  <div className="card h-100 overflow-hidden shadow-sm">
                    <img src={m.url} alt={m.filename} className="card-img-top" style={{ height: 160, objectFit: "cover" }} />
                    <div className="card-body p-3">
                      <div className="small text-truncate" title={m.filename}>
                        {m.filename}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
