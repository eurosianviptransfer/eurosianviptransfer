export type Theme = "dark" | "light";

export const STORAGE_KEY = "admin-theme";

export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "dark") return "dark";
  return "light";
}

export function setTheme(theme: Theme): Theme {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (document.documentElement.classList) {
      if (theme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    }
  }

  return theme;
}

export function initTheme(): Theme {
  const theme = getPreferredTheme();
  return setTheme(theme);
}
