import { useContext, createContext, useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useThemeProvider() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "auto");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const updateResolvedTheme = () => {
      if (theme === "auto") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    if (theme === "auto") {
      mediaQuery.addEventListener("change", updateResolvedTheme);
      return () => mediaQuery.removeEventListener("change", updateResolvedTheme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}
