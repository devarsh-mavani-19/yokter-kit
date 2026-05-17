import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../context/theme.context";

export function useTheme(): ThemeContextType {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return theme;
}
