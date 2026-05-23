import { TextStyle, ViewStyle } from "react-native";
import { ButtonSize, ButtonState, ButtonVariant } from "../../types";
import { useTheme } from "../../hooks";
import { buttonSizeConfig } from "../../constants";

export type UseGetButtonStylesProp = {
  buttonState?: ButtonState;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
};

export type UseGetButtonStylesReturn = {
  container: ViewStyle;
  text: TextStyle;
};

export const useGetButtonStyles = ({
  size = "md",
  variant = "solid",
  buttonState: state = "default",
  loading,
  disabled,
  danger,
}: UseGetButtonStylesProp): UseGetButtonStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const effectiveState: ButtonState = disabled || loading ? "disabled" : state;
  const dimensions = buttonSizeConfig[size];

  if (danger) {
    const container = resolveDangerContainerStyle(variant, effectiveState, colors, dimensions);
    const text = resolveDangerTextStyle(variant, effectiveState, colors, dimensions.fontSize);
    return { container, text };
  }

  const container = resolveContainerStyle(
    variant,
    effectiveState,
    colors,
    dimensions,
  );
  const text = resolveTextStyle(
    variant,
    effectiveState,
    colors,
    dimensions.fontSize,
  );

  return { container, text };
};

function resolveContainerStyle(
  variant: ButtonVariant,
  state: ButtonState,
  colors: Record<string, string>,
  dimensions: {
    height: number;
    paddingHorizontal: number;
    borderRadius: number;
  },
): ViewStyle {
  if (variant === "solid") {
    switch (state) {
      case "default":
        return { ...dimensions, backgroundColor: colors.buttonBackground };
      case "hover":
        return { ...dimensions, backgroundColor: colors.buttonBackgroundHover };
      case "press":
        return { ...dimensions, backgroundColor: colors.buttonBackgroundActive };
      case "disabled":
        return { ...dimensions, backgroundColor: colors.buttonDisabledBackground };
    }
  }

  // outlined
  switch (state) {
    case "default":
      return {
        ...dimensions,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.buttonBorder,
      };
    case "hover":
      return {
        ...dimensions,
        backgroundColor: colors.buttonAccent,
        borderWidth: 1,
        borderColor: colors.buttonBorder,
      };
    case "press":
      return {
        ...dimensions,
        backgroundColor: colors.buttonAccent,
        borderWidth: 1,
        borderColor: colors.buttonBorder,
      };
    case "disabled":
      return {
        ...dimensions,
        backgroundColor: colors.buttonDisabledBackground,
        borderWidth: 1,
        borderColor: colors.buttonDisabledBackground,
      };
  }
}

function resolveTextStyle(
  variant: ButtonVariant,
  state: ButtonState,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  if (state === "disabled") {
    return { fontSize, color: colors.buttonDisabledForeground };
  }

  if (variant === "outlined") {
    const color =
      state === "hover" || state === "press"
        ? colors.buttonAccentForeground
        : colors.baseForeground;
    return { fontSize, color };
  }

  return { fontSize, color: colors.buttonForeground };
}

function resolveDangerContainerStyle(
  variant: ButtonVariant,
  state: ButtonState,
  colors: Record<string, string>,
  dimensions: {
    height: number;
    paddingHorizontal: number;
    borderRadius: number;
  },
): ViewStyle {
  if (variant === "solid") {
    switch (state) {
      case "default":
        return { ...dimensions, backgroundColor: colors.buttonDangerBackground };
      case "hover":
        return { ...dimensions, backgroundColor: colors.buttonDangerBackgroundHover };
      case "press":
        return { ...dimensions, backgroundColor: colors.buttonDangerBackgroundActive };
      case "disabled":
        return { ...dimensions, backgroundColor: colors.buttonDangerDisabledBackground };
    }
  }

  // outlined
  const border: ViewStyle = { borderWidth: 1, borderColor: colors.buttonDangerBorder };
  switch (state) {
    case "default":
      return { ...dimensions, ...border, backgroundColor: "transparent" };
    case "hover":
      return { ...dimensions, ...border, backgroundColor: colors.buttonDangerAccent };
    case "press":
      return { ...dimensions, ...border, backgroundColor: colors.buttonDangerAccent };
    case "disabled":
      return { ...dimensions, ...border, backgroundColor: colors.buttonDangerDisabledBackground };
  }
}

function resolveDangerTextStyle(
  variant: ButtonVariant,
  state: ButtonState,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  if (state === "disabled") {
    return { fontSize, color: colors.buttonDangerDisabledForeground };
  }

  if (variant === "outlined") {
    return { fontSize, color: colors.buttonDangerAccentForeground };
  }

  const color = colors.buttonDangerForeground;
  return { fontSize, color };
}
