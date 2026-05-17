import { ColorSemanticToken } from "../../types";

export const lightModeColorSemantic: Record<ColorSemanticToken, string> = {
  // Base
  baseBackground: "#FFFFFF",
  baseForeground: "#09090B",
  baseBorder: "#E4E4E7",
  // Button
  buttonBackground: "#18181B",
  buttonForeground: "#FAFAFA",
  buttonBorder: "#E4E4E7",
  buttonBackgroundHover: "#27272A",
  buttonBackgroundActive: "#09090B",
  buttonAccent: "#F4F4F5",
  buttonAccentForeground: "#18181B",
  // Button - Disabled
  buttonDisabledBackground: "#F4F4F5",
  buttonDisabledForeground: "#A1A1AA",
  // Button - Danger
  buttonDangerBackground: "#DC2626",
  buttonDangerForeground: "#FAFAFA",
  buttonDangerBorder: "#DC2626",
  buttonDangerBackgroundHover: "#B91C1C",
  buttonDangerBackgroundActive: "#991B1B",
  buttonDangerAccent: "#FEF2F2",
  buttonDangerAccentForeground: "#DC2626",
  buttonDangerDisabledBackground: "#FECACA",
  buttonDangerDisabledForeground: "#F87171",
  // Input
  inputBackground: "transparent",
  inputForeground: "#09090B",
  inputBorder: "#E4E4E7",
  inputBorderFocus: "#18181B",
  inputRingFocus: "rgba(24, 24, 27, 0.2)",
  inputPlaceholder: "#A1A1AA",
  inputBorderError: "#DC2626",
  inputRingError: "rgba(220, 38, 38, 0.2)",
  inputDisabledBackground: "#F4F4F5",
  inputDisabledForeground: "#A1A1AA",
};
