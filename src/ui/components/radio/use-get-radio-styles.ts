import { TextStyle, ViewStyle } from "react-native";
import { RadioSize } from "../../types";
import { useTheme } from "../../hooks";
import { radioSizeConfig } from "../../constants";

export type UseGetRadioStylesProp = {
  size?: RadioSize;
  selected?: boolean;
  disabled?: boolean;
};

export type UseGetRadioStylesReturn = {
  outer: ViewStyle;
  dot: ViewStyle;
  label: TextStyle;
  gap: number;
};

export const useGetRadioStyles = ({
  size = "md",
  selected,
  disabled,
}: UseGetRadioStylesProp): UseGetRadioStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dimensions = radioSizeConfig[size];

  const outer = resolveOuterStyle(selected, disabled, colors, dimensions);
  const dot = resolveDotStyle(selected, disabled, colors, dimensions.dot);
  const label = resolveLabelStyle(disabled, colors, dimensions.labelFontSize);

  return { outer, dot, label, gap: dimensions.gap };
};

function resolveOuterStyle(
  selected: boolean | undefined,
  disabled: boolean | undefined,
  colors: Record<string, string>,
  dimensions: { outer: number },
): ViewStyle {
  const base: ViewStyle = {
    width: dimensions.outer,
    height: dimensions.outer,
    borderRadius: dimensions.outer / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  };

  if (disabled) {
    return {
      ...base,
      backgroundColor: colors.radioDisabledBackground,
      borderColor: colors.radioDisabledBorder,
    };
  }

  if (selected) {
    return {
      ...base,
      backgroundColor: colors.radioBackground,
      borderColor: colors.radioSelectedBorder,
    };
  }

  return {
    ...base,
    backgroundColor: colors.radioBackground,
    borderColor: colors.radioBorder,
  };
}

function resolveDotStyle(
  selected: boolean | undefined,
  disabled: boolean | undefined,
  colors: Record<string, string>,
  dotSize: number,
): ViewStyle {
  const base: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
  };

  if (disabled) {
    return { ...base, backgroundColor: colors.radioDisabledDot };
  }

  return { ...base, backgroundColor: colors.radioSelectedDot };
}

function resolveLabelStyle(
  disabled: boolean | undefined,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  return {
    fontSize,
    color: disabled ? colors.radioLabelDisabled : colors.radioLabel,
  };
}
