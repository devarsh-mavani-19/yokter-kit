import { TextStyle, ViewStyle } from "react-native";
import { WheelInputSize } from "../../types";
import { useTheme } from "../../hooks";
import { wheelInputSizeConfig } from "../../constants";

export type UseGetWheelInputStylesProp = {
  size?: WheelInputSize;
  disabled?: boolean;
};

export type UseGetWheelInputStylesReturn = {
  container: ViewStyle;
  highlight: ViewStyle;
  itemText: TextStyle;
  itemTextActive: TextStyle;
  itemTextFaded: TextStyle;
  measurer: ViewStyle;
  measurerText: TextStyle;
  itemHeight: number;
};

export const useGetWheelInputStyles = ({
  size = "md",
  disabled,
}: UseGetWheelInputStylesProp): UseGetWheelInputStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = wheelInputSizeConfig[size];

  const container: ViewStyle = {
    overflow: "hidden",
    ...(disabled ? { opacity: 0.5 } : {}),
  };

  const highlight: ViewStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.wheelInputHighlightBorder,
    height: dims.itemHeight,
  };

  const itemText: TextStyle = {
    fontSize: dims.fontSize,
    fontWeight: "400",
    color: disabled
      ? colors.wheelInputDisabledForeground
      : colors.wheelInputForeground,
    textAlign: "center",
    lineHeight: dims.itemHeight,
    height: dims.itemHeight,
  };

  const itemTextActive: TextStyle = {
    fontSize: dims.fontSizeActive,
    fontWeight: "600",
    color: disabled
      ? colors.wheelInputDisabledForeground
      : colors.wheelInputForegroundActive,
  };

  const itemTextFaded: TextStyle = {
    color: disabled
      ? colors.wheelInputDisabledForeground
      : colors.wheelInputForegroundFaded,
  };

  // Hidden row used to measure the widest label
  const measurer: ViewStyle = {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    flexDirection: "row",
  };

  // Use the larger (active) font size so the column never clips
  const measurerText: TextStyle = {
    fontSize: dims.fontSizeActive,
    fontWeight: "600",
    paddingHorizontal: 8,
  };

  return {
    container,
    highlight,
    itemText,
    itemTextActive,
    itemTextFaded,
    measurer,
    measurerText,
    itemHeight: dims.itemHeight,
  };
};
