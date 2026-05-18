import { ViewStyle } from "react-native";
import { SliderSize } from "../../types";
import { useTheme } from "../../hooks";
import { sliderSizeConfig } from "../../constants";

export type UseGetSliderStylesProp = {
  size?: SliderSize;
  disabled?: boolean;
};

export type UseGetSliderStylesReturn = {
  track: ViewStyle;
  fill: ViewStyle;
  thumb: ViewStyle;
};

export const useGetSliderStyles = ({
  size = "md",
  disabled,
}: UseGetSliderStylesProp): UseGetSliderStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = sliderSizeConfig[size];

  const track: ViewStyle = {
    height: dims.trackHeight,
    borderRadius: dims.trackHeight / 2,
    backgroundColor: disabled ? colors.sliderTrackDisabled : colors.sliderTrack,
    overflow: "hidden",
  };

  const fill: ViewStyle = {
    height: dims.trackHeight,
    borderRadius: dims.trackHeight / 2,
    backgroundColor: disabled ? colors.sliderFillDisabled : colors.sliderFill,
  };

  const thumb: ViewStyle = {
    width: dims.thumbSize,
    height: dims.thumbSize,
    borderRadius: dims.thumbSize / 2,
    backgroundColor: disabled ? colors.sliderThumbDisabled : colors.sliderThumb,
    borderWidth: 2,
    borderColor: disabled ? colors.sliderFillDisabled : colors.sliderThumbBorder,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  };

  return { track, fill, thumb };
};
