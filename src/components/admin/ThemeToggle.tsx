"use client";

import { useEffect, useState } from "react";
import { initTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const nextTheme = initTheme();
    setThemeState(nextTheme);
  }, []);

  const changeTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  return (
    <div className="ev-theme-toggle" aria-label="Admin tema seçici">
      <span className="ev-label" style={{ marginBottom: 8, display: "block" }}>Tema</span>
      <div className="ev-theme-switcher">
        <button
          type="button"
          className={`ev-btn ev-theme-switcher__button ${theme === "dark" ? "ev-btn--active" : "ev-btn--ghost"}`}
          onClick={() => changeTheme("dark")}
        >
          Dark
        </button>
        <button
          type="button"
          className={`ev-btn ev-theme-switcher__button ${theme === "light" ? "ev-btn--active" : "ev-btn--ghost"}`}
          onClick={() => changeTheme("light")}
        >
          Light
        </button>
      </div>
    </div>
  );
}
