import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

export const metadata = {
  title: "Eurosian VIP Transfer",
  description: "Antalya Havalimanı VIP transfer operasyon platformu",
  metadataBase: new URL(getAppUrl()),
  alternates: { canonical: getAppUrl() },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider><SessionProviderWrapper>{children}</SessionProviderWrapper></LanguageProvider>
      </body>
    </html>
  );
}
