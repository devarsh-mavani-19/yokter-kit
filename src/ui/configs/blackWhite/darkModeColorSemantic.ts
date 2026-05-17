import { ColorSemanticToken } from "../../types";

export const darkModeColorSemantic: Record<ColorSemanticToken, string> = {
  // Base
  baseBackground: "#09090B",
  baseForeground: "#FAFAFA",
  baseBorder: "#27272A",
  // Button
  buttonBackground: "#FAFAFA",
  buttonForeground: "#18181B",
  buttonBorder: "#27272A",
  buttonBackgroundHover: "#E4E4E7",
  buttonBackgroundActive: "#D4D4D8",
  buttonAccent: "#27272A",
  buttonAccentForeground: "#FAFAFA",
  // Button - Disabled
  buttonDisabledBackground: "#27272A",
  buttonDisabledForeground: "#71717A",
  // Button - Danger
  buttonDangerBackground: "#DC2626",
  buttonDangerForeground: "#FAFAFA",
  buttonDangerBorder: "#DC2626",
  buttonDangerBackgroundHover: "#EF4444",
  buttonDangerBackgroundActive: "#B91C1C",
  buttonDangerAccent: "#450A0A",
  buttonDangerAccentForeground: "#FCA5A5",
  buttonDangerDisabledBackground: "#450A0A",
  buttonDangerDisabledForeground: "#F87171",
  // Input
  inputBackground: "rgba(39, 39, 42, 0.3)",
  inputForeground: "#FAFAFA",
  inputBorder: "#27272A",
  inputBorderFocus: "#D4D4D8",
  inputRingFocus: "rgba(212, 212, 216, 0.2)",
  inputPlaceholder: "#71717A",
  inputBorderError: "#DC2626",
  inputRingError: "rgba(220, 38, 38, 0.4)",
  inputDisabledBackground: "#27272A",
  inputDisabledForeground: "#71717A",
};
