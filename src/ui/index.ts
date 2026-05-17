// Provider
export { ThemeProvider } from "./context/theme.context";

// Hooks
export { useTheme } from "./hooks";
export { useGetButtonStyles as useButtonStylesResolver } from "./components/button/use-get-button-theme";
export type {
  UseGetButtonStylesProp as UseButtonStylesProp,
  UseGetButtonStylesReturn as UseButtonStyleReturn,
} from "./components/button/use-get-button-theme";
export { Button } from "./components/button";
export type { ButtonProps } from "./components/button";
export { Typography } from "./components/typography";
export type { TypographyProps } from "./components/typography";
export { useGetTypographyStyles } from "./components/typography/use-get-typography-styles";
export type {
  UseGetTypographyStylesProp,
  UseGetTypographyStylesReturn,
} from "./components/typography/use-get-typography-styles";
export { Input } from "./components/input";
export type { InputProps } from "./components/input";
export { useGetInputStyles } from "./components/input/use-get-input-styles";
export type {
  UseGetInputStylesProp,
  UseGetInputStylesReturn,
} from "./components/input/use-get-input-styles";

// Theme creation
export { createTheme, defaultTheme } from "./createTheme";

// Primitives (for direct access)
export { darkModeColorSemantic } from "./configs/blackWhite/darkModeColorSemantic";
export { lightModeColorSemantic } from "./configs/blackWhite/lightModeColorSemantic";
export { spacing } from "./configs/blackWhite/spacing";
export { radius } from "./configs/blackWhite/radius";
export { shadow as shadows } from "./configs/blackWhite/shadows";
export { zIndex } from "./configs/blackWhite/zIndex";
export {
  lineHeights,
  letterSpacings,
  typography,
} from "./configs/blackWhite/typography";

// Types
export type {
  ThemeConfig,
  ColorMode,
  FontWeight,
  SpacingSize,
  RadiusSize,
  ShadowType,
  ShadowStyle,
  ZIndexType,
  SizeScale,
  LineHeightSize,
  LetterSpacingSize,
  ColorSemanticToken,
  TypographyVariant,
  TypographyVariantStyle,
  ButtonVariant,
  ButtonSize,
  ButtonState,
  ButtonStyle,
  ButtonTheme,
  ButtonSizeToState,
  ButtonStateToStyle,
  InputSize,
  InputState,
  DeepPartial,
  FormInputFieldProps,
} from "./types";
