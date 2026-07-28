export type Theme = "dark" | "light";

export const STORAGE_KEY = "admin-theme";

export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light") return "light";
  return "dark";
}

export function setTheme(theme: Theme): Theme {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }

  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }

  return theme;
}

export function initTheme(): Theme {
  const theme = getPreferredTheme();
  return setTheme(theme);
}
