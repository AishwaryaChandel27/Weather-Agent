import { createContext, ReactNode } from "react";
import { useThemeProvider, ThemeContext } from "@/hooks/useTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useThemeProvider();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}
