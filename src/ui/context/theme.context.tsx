import { createContext, useContext, useMemo, useState } from "react";
import type { ColorMode, ThemeConfig } from "../types";
import { DeepPartial } from "../types";
import { createTheme } from "../createTheme";

export type ThemeContextType = {
  themeConfig: ThemeConfig;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export type ThemeProviderProps = {
  theme?: DeepPartial<ThemeConfig>;
  mode?: ColorMode;
  children: React.ReactNode;
};

export function ThemeProvider({
  theme: initialTheme,
  mode = "light",
  children,
}: ThemeProviderProps) {
  const [colorMode, setColorMode] = useState<ColorMode>(mode);
  const theme = useMemo((): ThemeConfig => {
    return createTheme(initialTheme);
  }, [initialTheme]);

  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        setColorMode,
        themeConfig: theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("[useThemeContext] must be used within a ThemeProvider");
  }
  return context;
}
