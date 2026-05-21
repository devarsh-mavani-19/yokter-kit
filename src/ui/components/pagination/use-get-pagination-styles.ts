import { TextStyle, ViewStyle } from "react-native";
import { PaginationSize } from "../../types";
import { useTheme } from "../../hooks";
import { paginationSizeConfig } from "../../constants";

export type UseGetPaginationStylesProp = {
  size?: PaginationSize;
  disabled?: boolean;
};

export type UseGetPaginationStylesReturn = {
  container: ViewStyle;
  arrowButton: ViewStyle;
  arrowText: TextStyle;
  inputContainer: ViewStyle;
  inputText: TextStyle;
  separator: TextStyle;
  total: TextStyle;
};

export const useGetPaginationStyles = ({
  size = "md",
  disabled,
}: UseGetPaginationStylesProp): UseGetPaginationStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dimensions = paginationSizeConfig[size];

  const container: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: dimensions.gap,
  };

  const arrowButton: ViewStyle = {
    width: dimensions.arrowSize,
    paddingHorizontal: 0,
  };

  const arrowText: TextStyle = {
    fontSize: dimensions.fontSize + 8,
    color: disabled
      ? colors.paginationDisabledForeground
      : colors.paginationArrowForeground,
  };

  const inputContainer: ViewStyle = {
    minWidth: dimensions.inputMinWidth,
  };

  const inputText: TextStyle = {
    textAlign: "center",
  };

  const separator: TextStyle = {
    fontSize: dimensions.fontSize,
    color: colors.paginationForeground,
  };

  const total: TextStyle = {
    fontSize: dimensions.fontSize,
    color: colors.paginationForeground,
  };

  return { container, arrowButton, arrowText, inputContainer, inputText, separator, total };
};
