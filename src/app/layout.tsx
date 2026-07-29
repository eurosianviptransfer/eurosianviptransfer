import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

function buildThemeInitScript(serverTheme: string) {
  return `
    (function() {
      try {
        const storageKey = "admin-theme";
        const savedTheme = window.localStorage.getItem(storageKey);
        // If user has a saved preference, use it; otherwise default to server-provided theme
        if (savedTheme === "light" || savedTheme === "dark") {
          document.documentElement.dataset.theme = savedTheme;
          document.documentElement.style.colorScheme = savedTheme;
        } else {
          document.documentElement.dataset.theme = "${serverTheme}";
          document.documentElement.style.colorScheme = "${serverTheme}";
          try { window.localStorage.setItem(storageKey, "${serverTheme}"); } catch(e){}
        }
      } catch (error) {
        console.error("Theme init failed", error);
      }
    })();
  `;
}

export const metadata = {
  title: "Eurosian VIP Transfer",
  description: "Antalya Havalimanı VIP transfer operasyon platformu",
  metadataBase: new URL(getAppUrl()),
  alternates: { canonical: getAppUrl() },
};

import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Determine server-side theme from cookie so SSR markup matches client pre-hydration
  const cookieStore = await cookies();
  const serverTheme = cookieStore.get("admin-theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="en" data-theme={serverTheme} style={{ colorScheme: serverTheme }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildThemeInitScript(serverTheme) }} />
      </head>
      <body>
        <LanguageProvider><SessionProviderWrapper>{children}</SessionProviderWrapper></LanguageProvider>
      </body>
    </html>
  );
}
