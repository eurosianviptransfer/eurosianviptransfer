import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ContentListPage() {
  let entries = [] as Array<{ id: string; key: string; locale: string; title: string }>;
  let error: string | null = null;

  try {
    const rawEntries = await prisma.contentEntry.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
    entries = rawEntries.map((entry) => ({
      id: entry.id,
      key: entry.key,
      locale: entry.locale,
      title: entry.title ?? "Untitled",
    }));
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Content Library</h1>
          <p className="text-muted mb-0">Manage your CMS entries and keep the site content up to date.</p>
        </div>
        <Link href="/admin-revamp/content/new" className="btn btn-primary btn-sm px-4">
          + New Content
        </Link>
      </div>

      {error && <div className="alert alert-warning">Database unavailable: showing empty list. ({error})</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-3 gap-3">
            <div>
              <h5 className="mb-1">Content entries</h5>
              <p className="text-muted mb-0">{entries.length} records available.</p>
            </div>
            <div className="input-group" style={{ maxWidth: 320 }}>
              <span className="input-group-text bg-white border-end-0">🔎</span>
              <input type="search" className="form-control border-start-0" placeholder="Search content" disabled />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Key</th>
                  <th>Locale</th>
                  <th>Title</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      No content entries found.
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e.id}>
                      <td>{e.key}</td>
                      <td>{e.locale}</td>
                      <td>{e.title}</td>
                      <td className="text-end">
                        <Link href={`/admin-revamp/content/${e.id}`} className="btn btn-sm btn-outline-secondary me-2">
                          Edit
                        </Link>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
