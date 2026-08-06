"use client";

import React from "react";
import { VercelAdminLayout } from "../vercel/VercelAdminLayout";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <VercelAdminLayout>{children}</VercelAdminLayout>;
};
