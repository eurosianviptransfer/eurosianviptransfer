"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
      <div className="flex h-screen overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* CONTENT AREA */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* HEADER */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* MAIN CONTENT */}
          <main className="flex-1 px-4 py-6 md:px-6 2xl:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
