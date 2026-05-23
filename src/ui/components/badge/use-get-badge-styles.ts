import { TextStyle, ViewStyle } from "react-native";
import { BadgeSize, BadgeVariant } from "../../types";
import { useTheme } from "../../hooks";
import { badgeSizeConfig } from "../../constants";

export type UseGetBadgeStylesProp = {
  size?: BadgeSize;
  variant?: BadgeVariant;
};

export type UseGetBadgeStylesReturn = {
  container: ViewStyle;
  text: TextStyle;
};

export const useGetBadgeStyles = ({
  size = "md",
  variant = "default",
}: UseGetBadgeStylesProp): UseGetBadgeStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = badgeSizeConfig[size];

  const variantColors = {
    default: {
      background: colors.badgeDefaultBackground,
      foreground: colors.badgeDefaultForeground,
      border: colors.badgeDefaultBorder,
    },
    secondary: {
      background: colors.badgeSecondaryBackground,
      foreground: colors.badgeSecondaryForeground,
      border: colors.badgeSecondaryBorder,
    },
    destructive: {
      background: colors.badgeDestructiveBackground,
      foreground: colors.badgeDestructiveForeground,
      border: colors.badgeDestructiveBorder,
    },
    outline: {
      background: colors.badgeOutlineBackground,
      foreground: colors.badgeOutlineForeground,
      border: colors.badgeOutlineBorder,
    },
  };

  const v = variantColors[variant];

  const container: ViewStyle = {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: dims.paddingHorizontal,
    paddingVertical: dims.paddingVertical,
    borderRadius: dims.borderRadius,
    backgroundColor: v.background,
    borderWidth: 1,
    borderColor: v.border,
  };

  const text: TextStyle = {
    fontSize: dims.fontSize,
    fontWeight: "600",
    color: v.foreground,
    lineHeight: dims.fontSize * 1.4,
  };

  return { container, text };
};
