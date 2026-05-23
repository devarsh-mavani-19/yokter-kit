import { TextStyle } from "react-native";
import { TypographyVariant } from "../../types";
import { useTheme } from "../../hooks";

export type UseGetTypographyStylesProp = {
  variant?: TypographyVariant;
};

export type UseGetTypographyStylesReturn = {
  text: TextStyle;
};

export const useGetTypographyStyles = ({
  variant = "body1",
}: UseGetTypographyStylesProp): UseGetTypographyStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const variantStyle = themeConfig.typography[variant];

  const text: TextStyle = {
    fontSize: variantStyle.fontSize,
    lineHeight: variantStyle.lineHeight,
    fontFamily: variantStyle.fontFamily,
    fontWeight: variantStyle.fontWeight,
    letterSpacing: variantStyle.letterSpacing,
    color: colors.baseForeground,
  };

  return { text };
};
