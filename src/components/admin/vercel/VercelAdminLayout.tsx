"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { VercelSidebar } from "./VercelSidebar";
import { VercelTopBar } from "./VercelTopBar";
import { VercelCommandKModal } from "./VercelCommandKModal";
import { VercelCmsDrawer, type CmsEntry } from "./VercelCmsDrawer";

export const VercelAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [commandKOpen, setCommandKOpen] = useState(false);
  const [cmsDrawerOpen, setCmsDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/giris" || pathname?.endsWith("/admin/giris");

  useEffect(() => {
    if (!isLoginPage && status === "unauthenticated") {
      router.push("/admin/giris");
    }
  }, [isLoginPage, status, router]);

  const handleSaveCmsEntry = (entry: CmsEntry) => {
    console.log("Saving CMS Entry from Vercel Geist Panel:", entry);
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased m-0 p-0 flex flex-col justify-start">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b15] text-amber-400 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex relative">
      {/* VERTICAL LEFT SIDEBAR */}
      <VercelSidebar
        onOpenCommandK={() => setCommandKOpen(true)}
        onOpenNewDrawer={() => setCmsDrawerOpen(true)}
        isMobileOpen={mobileMenuOpen}
        setIsMobileOpen={setMobileMenuOpen}
      />

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* TOP BAR */}
        <VercelTopBar
          onOpenCommandK={() => setCommandKOpen(true)}
          onOpenNewDrawer={() => setCmsDrawerOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* MAIN PAGE BODY */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
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
