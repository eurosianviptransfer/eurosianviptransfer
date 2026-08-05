"use client";
import React, { useState } from "react";

export default function MediaUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setStatus("No file selected");
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch('/api/uploads/media', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setStatus('Uploaded');
    } catch (err: any) {
      setStatus('Error: ' + (err?.message ?? String(err)));
    }
  }

  return (
    <div>
      <h1 className="h4 mb-3">Upload Media</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={upload}>
            <div className="mb-3">
              <input type="file" className="form-control" onChange={(ev) => setFile(ev.target.files?.[0] ?? null)} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">Upload</button>
              <a className="btn btn-outline-secondary" href="/admin-revamp/media">Back</a>
            </div>
          </form>
          {status && <div className="mt-3"><div className="alert alert-info">{status}</div></div>}
        </div>
      </div>
    </div>
  );
}
