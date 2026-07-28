import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const themeInitScript = `
  (function() {
    try {
      const storageKey = "admin-theme";
      const savedTheme = window.localStorage.getItem(storageKey);
      const theme = savedTheme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      console.error("Theme init failed", error);
    }
  })();
`;

export const metadata = {
  title: "Eurosian VIP Transfer",
  description: "Antalya Havalimanı VIP transfer operasyon platformu",
  metadataBase: new URL(getAppUrl()),
  alternates: { canonical: getAppUrl() },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <LanguageProvider><SessionProviderWrapper>{children}</SessionProviderWrapper></LanguageProvider>
      </body>
    </html>
  );
}
