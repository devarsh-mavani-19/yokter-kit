import { TextStyle, ViewStyle } from "react-native";
import { SwitchSize } from "../../types";
import { useTheme } from "../../hooks";
import { switchSizeConfig } from "../../constants";

export type UseGetSwitchStylesProp = {
  size?: SwitchSize;
  active?: boolean;
  disabled?: boolean;
};

export type UseGetSwitchStylesReturn = {
  track: ViewStyle;
  thumb: ViewStyle;
  label: TextStyle;
  gap: number;
  thumbTranslate: number;
};

export const useGetSwitchStyles = ({
  size = "md",
  active,
  disabled,
}: UseGetSwitchStylesProp): UseGetSwitchStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dimensions = switchSizeConfig[size];
  const padding = 2;
  const thumbTranslate = dimensions.track.width - dimensions.thumb - padding * 2;

  const track = resolveTrackStyle(active, disabled, colors, dimensions, padding);
  const thumb = resolveThumbStyle(active, disabled, colors, dimensions.thumb);
  const label = resolveLabelStyle(disabled, colors, dimensions.labelFontSize);

  return { track, thumb, label, gap: dimensions.gap, thumbTranslate };
};

function resolveTrackStyle(
  active: boolean | undefined,
  disabled: boolean | undefined,
  colors: Record<string, string>,
  dimensions: { track: { width: number; height: number } },
  padding: number,
): ViewStyle {
  const base: ViewStyle = {
    width: dimensions.track.width,
    height: dimensions.track.height,
    borderRadius: dimensions.track.height / 2,
    justifyContent: "center",
    paddingHorizontal: padding,
  };

  if (disabled) {
    return { ...base, backgroundColor: colors.switchTrackDisabled };
  }

  return {
    ...base,
    backgroundColor: active ? colors.switchTrackActive : colors.switchTrack,
  };
}

function resolveThumbStyle(
  active: boolean | undefined,
  disabled: boolean | undefined,
  colors: Record<string, string>,
  thumbSize: number,
): ViewStyle {
  const base: ViewStyle = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  };

  if (disabled) {
    return { ...base, backgroundColor: colors.switchThumbDisabled };
  }

  return {
    ...base,
    backgroundColor: active ? colors.switchThumbActive : colors.switchThumb,
  };
}

function resolveLabelStyle(
  disabled: boolean | undefined,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  return {
    fontSize,
    color: disabled ? colors.switchLabelDisabled : colors.switchLabel,
  };
}
