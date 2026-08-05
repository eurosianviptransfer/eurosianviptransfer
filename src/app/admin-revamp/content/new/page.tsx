export default function NewContentPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">New Content</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form method="post" action="/api/admin/content">
            <div className="mb-3">
              <label className="form-label">Key</label>
              <input name="key" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Locale</label>
              <input name="locale" className="form-control" defaultValue="en" />
            </div>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input name="title" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Body (HTML)</label>
              <textarea name="body" className="form-control" rows={8} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary">Create</button>
              <a className="btn btn-outline-secondary" href="/admin-revamp/content">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
