import { TextStyle, ViewStyle } from "react-native";
import { DropdownSize } from "../../types";
import { useTheme } from "../../hooks";
import { dropdownSizeConfig } from "../../constants";

export type UseGetDropdownStylesProp = {
  size?: DropdownSize;
  open?: boolean;
  disabled?: boolean;
  error?: boolean;
};

export type UseGetDropdownStylesReturn = {
  trigger: ViewStyle;
  triggerText: TextStyle;
  placeholder: { color: string };
  chevron: { size: number; color: string };
  panel: ViewStyle;
  item: ViewStyle;
  itemText: TextStyle;
  itemActive: ViewStyle;
  itemActiveText: TextStyle;
  dimensions: {
    itemHeight: number;
    maxPanelHeight: number;
  };
};

export const useGetDropdownStyles = ({
  size = "md",
  open,
  disabled,
  error,
}: UseGetDropdownStylesProp): UseGetDropdownStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = dropdownSizeConfig[size];

  const trigger = resolveTriggerStyle(open, disabled, error, colors, dims);
  const triggerText = resolveTriggerTextStyle(disabled, colors, dims.fontSize);
  const placeholderColor = disabled
    ? colors.dropdownTriggerDisabledForeground
    : colors.dropdownTriggerPlaceholder;
  const chevronColor = disabled
    ? colors.dropdownTriggerDisabledForeground
    : colors.dropdownTriggerForeground;

  const panel = resolvePanelStyle(colors, dims);
  const item = resolveItemStyle(colors, dims);
  const itemText: TextStyle = { fontSize: dims.fontSize, color: colors.dropdownItemForeground };
  const itemActive: ViewStyle = { backgroundColor: colors.dropdownItemBackgroundActive };
  const itemActiveText: TextStyle = { color: colors.dropdownItemForegroundActive };

  return {
    trigger,
    triggerText,
    placeholder: { color: placeholderColor },
    chevron: { size: dims.chevronSize, color: chevronColor },
    panel,
    item,
    itemText,
    itemActive,
    itemActiveText,
    dimensions: {
      itemHeight: dims.itemHeight,
      maxPanelHeight: dims.maxPanelHeight,
    },
  };
};

function resolveTriggerStyle(
  open: boolean | undefined,
  disabled: boolean | undefined,
  error: boolean | undefined,
  colors: Record<string, string>,
  dims: { triggerHeight: number; paddingHorizontal: number; borderRadius: number },
): ViewStyle {
  const base: ViewStyle = {
    height: dims.triggerHeight,
    paddingHorizontal: dims.paddingHorizontal,
    borderRadius: dims.borderRadius,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  };

  if (disabled) {
    return {
      ...base,
      backgroundColor: colors.dropdownTriggerDisabledBackground,
      borderColor: colors.dropdownTriggerDisabledBorder,
      opacity: 0.5,
    };
  }

  if (error) {
    return {
      ...base,
      backgroundColor: colors.dropdownTriggerBackground,
      borderColor: colors.inputBorderError,
    };
  }

  return {
    ...base,
    backgroundColor: colors.dropdownTriggerBackground,
    borderColor: open ? colors.dropdownTriggerBorderFocus : colors.dropdownTriggerBorder,
  };
}

function resolveTriggerTextStyle(
  disabled: boolean | undefined,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  return {
    fontSize,
    color: disabled
      ? colors.dropdownTriggerDisabledForeground
      : colors.dropdownTriggerForeground,
    flex: 1,
  };
}

function resolvePanelStyle(
  colors: Record<string, string>,
  dims: { borderRadius: number; maxPanelHeight: number },
): ViewStyle {
  return {
    backgroundColor: colors.dropdownPanelBackground,
    borderWidth: 1,
    borderColor: colors.dropdownPanelBorder,
    borderRadius: dims.borderRadius,
    maxHeight: dims.maxPanelHeight,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  };
}

function resolveItemStyle(
  colors: Record<string, string>,
  dims: { itemHeight: number; paddingHorizontal: number },
): ViewStyle {
  return {
    height: dims.itemHeight,
    paddingHorizontal: dims.paddingHorizontal,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dropdownPanelBackground,
  };
}
