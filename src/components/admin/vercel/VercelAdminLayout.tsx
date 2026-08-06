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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-blue-500 selection:text-white m-0 p-0 transition-colors">
      {/* VERCEL HEADER STUCK AT TOP-0 */}
      <VercelHeader
        onOpenCommandK={() => setCommandKOpen(true)}
        onOpenNewDrawer={() => setCmsDrawerOpen(true)}
      />

      {/* FULL-WIDTH MAIN CONTENT AREA DIRECTLY BELOW HEADER */}
      <main className="px-3 py-3 md:px-5">
        <div className="mx-auto max-w-7xl space-y-3">
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
