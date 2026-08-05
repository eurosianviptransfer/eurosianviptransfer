import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  let totals = {
    bookings: 0,
    users: 0,
    contentEntries: 0,
    mediaItems: 0,
  };
  let error: string | null = null;

  try {
    const [bookings, users, contentEntries, mediaItems] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count(),
      prisma.contentEntry.count(),
      prisma.mediaItem.count(),
    ]);

    totals = { bookings, users, contentEntries, mediaItems };
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <h2 className="mb-1">Welcome back, Super Admin</h2>
            <p className="text-muted mb-0">Your new Bootstrap-based admin dashboard is ready. Use the sidebar to navigate and the cards below to monitor the core metrics.</p>
          </div>
          <div className="d-flex gap-2">
            <Link href="/admin-revamp/content/new" className="btn btn-primary">Add content</Link>
            <Link href="/admin-revamp/media/upload" className="btn btn-outline-secondary">Upload media</Link>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-warning">Data unavailable: {error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Bookings</h6>
                  <h3 className="mb-0">{totals.bookings}</h3>
                </div>
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  📦
                </div>
              </div>
              <p className="mb-0 text-muted">Active booking count from the database.</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Users</h6>
                  <h3 className="mb-0">{totals.users}</h3>
                </div>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  👥
                </div>
              </div>
              <p className="mb-0 text-muted">Total registered admin and staff accounts.</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Content</h6>
                  <h3 className="mb-0">{totals.contentEntries}</h3>
                </div>
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  📝
                </div>
              </div>
              <p className="mb-0 text-muted">Published and draft content entries in the CMS.</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Media</h6>
                  <h3 className="mb-0">{totals.mediaItems}</h3>
                </div>
                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  🖼️
                </div>
              </div>
              <p className="mb-0 text-muted">Uploaded assets available for page and marketing content.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h5 className="mb-1">Activity overview</h5>
                  <p className="text-muted mb-0">A quick glance at the latest admin activity and content pipeline.</p>
                </div>
                <button className="btn btn-sm btn-outline-secondary">View reports</button>
              </div>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="border rounded-4 p-3 bg-light h-100">
                    <div className="text-muted small mb-2">Pending updates</div>
                    <div className="d-flex align-items-end justify-content-between gap-3">
                      <strong>12</strong>
                      <span className="badge bg-secondary">Today</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="border rounded-4 p-3 bg-light h-100">
                    <div className="text-muted small mb-2">New media uploads</div>
                    <div className="d-flex align-items-end justify-content-between gap-3">
                      <strong>8</strong>
                      <span className="badge bg-secondary">Last 24h</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="border rounded-4 p-3 bg-light h-100">
                    <div className="text-muted small mb-2">Content drafts</div>
                    <div className="d-flex align-items-end justify-content-between gap-3">
                      <strong>5</strong>
                      <span className="badge bg-secondary">In review</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="border rounded-4 p-3 bg-light h-100">
                    <div className="text-muted small mb-2">Admin sign-ins</div>
                    <div className="d-flex align-items-end justify-content-between gap-3">
                      <strong>3</strong>
                      <span className="badge bg-secondary">Last hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-3">Quick links</h5>
              <div className="list-group list-group-flush">
                <Link href="/admin-revamp/content" className="list-group-item list-group-item-action rounded-4 mb-2">Edit content entries</Link>
                <Link href="/admin-revamp/media" className="list-group-item list-group-item-action rounded-4 mb-2">Manage media library</Link>
                <Link href="/admin-revamp/users" className="list-group-item list-group-item-action rounded-4 mb-2">Review users</Link>
                <Link href="/admin-revamp/settings" className="list-group-item list-group-item-action rounded-4">Update settings</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
