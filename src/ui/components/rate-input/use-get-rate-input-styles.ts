import { TextStyle, ViewStyle } from "react-native";
import { RateInputSize } from "../../types";
import { useTheme } from "../../hooks";
import { rateInputSizeConfig } from "../../constants";

export type UseGetRateInputStylesProp = {
  size?: RateInputSize;
  disabled?: boolean;
};

export type UseGetRateInputStylesReturn = {
  container: ViewStyle;
  symbol: ViewStyle;
  emoji: TextStyle;
  fillColor: string;
  baseColor: string;
};

export const useGetRateInputStyles = ({
  size = "md",
  disabled,
}: UseGetRateInputStylesProp): UseGetRateInputStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = rateInputSizeConfig[size];

  const container: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: dims.spacing,
  };

  const symbol: ViewStyle = {
    width: dims.symbolSize,
    height: dims.symbolSize,
    alignItems: "center",
    justifyContent: "center",
  };

  const emoji: TextStyle = {
    fontSize: dims.fontSize,
    lineHeight: dims.symbolSize,
    textAlign: "center",
  };

  const fillColor = disabled ? colors.rateInputDisabled : colors.rateInputFill;
  const baseColor = disabled ? colors.rateInputDisabled : colors.rateInputBase;

  return { container, symbol, emoji, fillColor, baseColor };
};
