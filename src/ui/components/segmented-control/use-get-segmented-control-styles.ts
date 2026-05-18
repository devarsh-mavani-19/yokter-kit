import { TextStyle, ViewStyle } from "react-native";
import { SegmentedControlSize } from "../../types";
import { useTheme } from "../../hooks";
import { segmentedControlSizeConfig } from "../../constants";

export type UseGetSegmentedControlStylesProp = {
  size?: SegmentedControlSize;
  disabled?: boolean;
};

export type UseGetSegmentedControlStylesReturn = {
  container: ViewStyle;
  item: ViewStyle;
  itemActive: ViewStyle;
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

  const container: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: dims.padding * 2 + 4,
    ...(disabled ? { opacity: 0.6 } : {}),
  };

  const item: ViewStyle = {
    height: dims.height,
    borderRadius: dims.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: dims.paddingHorizontal,
    backgroundColor: colors.segmentedBackground,
    borderWidth: 1,
    borderColor: colors.segmentedBorder,
  };

  const itemActive: ViewStyle = {
    backgroundColor: colors.segmentedItemBackgroundActive,
    borderColor: colors.segmentedItemForegroundActive,
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

  return { container, item, itemActive, itemText, itemTextActive };
};
