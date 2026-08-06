"use client";

import React, { useState } from "react";
import { VercelHeader } from "./VercelHeader";
import { VercelSidebar } from "./VercelSidebar";
import { VercelCommandKModal } from "./VercelCommandKModal";
import { VercelCmsDrawer, type CmsEntry } from "./VercelCmsDrawer";

export const VercelAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandKOpen, setCommandKOpen] = useState(false);
  const [cmsDrawerOpen, setCmsDrawerOpen] = useState(false);

  const handleSaveCmsEntry = (entry: CmsEntry) => {
    console.log("Saving CMS Entry from Vercel Geist Panel:", entry);
    // Dispatches save action or custom event if needed
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100">
      <div className="flex h-screen overflow-hidden">
        {/* VERCEL SIDEBAR */}
        <VercelSidebar
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* CONTENT WRAPPER */}
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-zinc-950">
          {/* VERCEL HEADER */}
          <VercelHeader
            onOpenCommandK={() => setCommandKOpen(true)}
            onOpenNewDrawer={() => setCmsDrawerOpen(true)}
            onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          {/* MAIN PAGE CONTENT */}
          <main className="flex-1 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>

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
