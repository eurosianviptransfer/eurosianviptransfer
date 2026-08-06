"use client";

import React, { useState } from "react";
import { VercelHeader } from "./VercelHeader";
import { VercelCommandKModal } from "./VercelCommandKModal";
import { VercelCmsDrawer, type CmsEntry } from "./VercelCmsDrawer";

export const VercelAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commandKOpen, setCommandKOpen] = useState(false);
  const [cmsDrawerOpen, setCmsDrawerOpen] = useState(false);

  const handleSaveCmsEntry = (entry: CmsEntry) => {
    console.log("Saving CMS Entry from Vercel Geist Panel:", entry);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100 m-0 p-0">
      {/* VERCEL HEADER STUCK DIRECTLY AT TOP-0 */}
      <VercelHeader
        onOpenCommandK={() => setCommandKOpen(true)}
        onOpenNewDrawer={() => setCmsDrawerOpen(true)}
      />

      {/* FULL-WIDTH MAIN CONTENT AREA DIRECTLY BELOW HEADER */}
      <main className="px-4 py-4 md:px-6">
        <div className="mx-auto max-w-7xl space-y-4">
          {children}
        </div>
      </main>

      {/* COMMAND K MODAL */}
      <VercelCommandKModal
        isOpen={commandKOpen}
        onClose={() => setCommandKOpen(false)}
      />

      {/* VERCEL CMS DRAWER */}
      <VercelCmsDrawer
        isOpen={cmsDrawerOpen}
        onClose={() => setCmsDrawerOpen(false)}
        onSave={handleSaveCmsEntry}
      />
    </div>
  );
};
