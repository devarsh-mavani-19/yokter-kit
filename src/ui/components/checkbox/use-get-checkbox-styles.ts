import { TextStyle, ViewStyle } from "react-native";
import { CheckboxSize, CheckboxState } from "../../types";
import { useTheme } from "../../hooks";
import { checkboxSizeConfig } from "../../constants";

export type UseGetCheckboxStylesProp = {
  size?: CheckboxSize;
  state?: CheckboxState;
  disabled?: boolean;
};

export type UseGetCheckboxStylesReturn = {
  box: ViewStyle;
  icon: { size: number; color: string };
  label: TextStyle;
  gap: number;
};

export const useGetCheckboxStyles = ({
  size = "md",
  state = "unchecked",
  disabled,
}: UseGetCheckboxStylesProp): UseGetCheckboxStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dimensions = checkboxSizeConfig[size];
  const isChecked = state === "checked" || state === "indeterminate";

  const box = resolveBoxStyle(isChecked, disabled, colors, dimensions);
  const icon = resolveIconStyle(isChecked, disabled, colors, dimensions.iconSize);
  const label = resolveLabelStyle(disabled, colors, dimensions.labelFontSize);

  return { box, icon, label, gap: dimensions.gap };
};

function resolveBoxStyle(
  isChecked: boolean,
  disabled: boolean | undefined,
  colors: Record<string, string>,
  dimensions: { box: number; borderRadius: number },
): ViewStyle {
  const base: ViewStyle = {
    width: dimensions.box,
    height: dimensions.box,
    borderRadius: dimensions.borderRadius,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  };

  if (disabled) {
    return {
      ...base,
      backgroundColor: colors.checkboxDisabledBackground,
      borderColor: colors.checkboxDisabledBorder,
    };
  }

  if (isChecked) {
    return {
      ...base,
      backgroundColor: colors.checkboxCheckedBackground,
      borderColor: colors.checkboxCheckedBorder,
    };
  }

  return {
    ...base,
    backgroundColor: colors.checkboxBackground,
    borderColor: colors.checkboxBorder,
  };
}

function resolveIconStyle(
  isChecked: boolean,
  disabled: boolean | undefined,
  colors: Record<string, string>,
  iconSize: number,
): { size: number; color: string } {
  if (disabled) {
    return { size: iconSize, color: colors.checkboxDisabledForeground };
  }

  if (isChecked) {
    return { size: iconSize, color: colors.checkboxCheckedForeground };
  }

  return { size: iconSize, color: colors.checkboxForeground };
}

function resolveLabelStyle(
  disabled: boolean | undefined,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  return {
    fontSize,
    color: disabled ? colors.checkboxLabelDisabled : colors.checkboxLabel,
  };
}
