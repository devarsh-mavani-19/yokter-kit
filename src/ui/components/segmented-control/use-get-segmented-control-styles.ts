import { TextStyle, ViewStyle } from "react-native";
import { SegmentedControlSize } from "../../types";
import { useTheme } from "../../hooks";
import { segmentedControlSizeConfig } from "../../constants";

export type ItemPosition = "first" | "middle" | "last" | "only";

export type UseGetSegmentedControlStylesProp = {
  size?: SegmentedControlSize;
  disabled?: boolean;
};

export type UseGetSegmentedControlStylesReturn = {
  container: ViewStyle;
  item: ViewStyle;
  getItemActiveStyle: (position: ItemPosition) => ViewStyle;
  itemText: TextStyle;
  itemTextActive: TextStyle;
};

export const useGetSegmentedControlStyles = ({
  size = "md",
  disabled,
}: UseGetSegmentedControlStylesProp): UseGetSegmentedControlStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = segmentedControlSizeConfig[size];
  const r = dims.borderRadius;

  const container: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    ...(disabled ? { opacity: 0.5 } : {}),
  };

  const item: ViewStyle = {
    height: dims.height,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: dims.paddingHorizontal,
  };

  const getItemActiveStyle = (position: ItemPosition): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: colors.segmentedItemBackgroundActive,
    };

    switch (position) {
      case "first":
        return { ...base, borderTopLeftRadius: r, borderBottomLeftRadius: r };
      case "last":
        return { ...base, borderTopRightRadius: r, borderBottomRightRadius: r };
      case "only":
        return { ...base, borderRadius: r };
      case "middle":
      default:
        return base;
    }
  };

  const itemText: TextStyle = {
    fontSize: dims.fontSize,
    color: disabled ? colors.segmentedDisabledForeground : colors.segmentedItemForeground,
    fontWeight: "500",
  };

  const itemTextActive: TextStyle = {
    color: disabled ? colors.segmentedDisabledForeground : colors.segmentedItemForegroundActive,
    fontWeight: "600",
  };

  return { container, item, getItemActiveStyle, itemText, itemTextActive };
};
