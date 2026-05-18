import { TextStyle, ViewStyle } from "react-native";
import { InputState, TextAreaSize } from "../../types";
import { useTheme } from "../../hooks";
import { textAreaSizeConfig } from "../../constants";

export type UseGetTextAreaStylesProp = {
  size?: TextAreaSize;
  inputState?: InputState;
  disabled?: boolean;
  error?: boolean;
};

export type UseGetTextAreaStylesReturn = {
  container: ViewStyle;
  input: TextStyle;
  placeholder: { color: string };
};

export const useGetTextAreaStyles = ({
  size = "md",
  inputState = "default",
  disabled,
  error,
}: UseGetTextAreaStylesProp): UseGetTextAreaStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const effectiveState: InputState = disabled
    ? "disabled"
    : error
      ? "error"
      : inputState;

  const dimensions = textAreaSizeConfig[size];

  const container = resolveContainerStyle(effectiveState, colors, dimensions);
  const input = resolveInputStyle(effectiveState, colors, dimensions.fontSize);
  const placeholder = { color: colors.inputPlaceholder };

  return { container, input, placeholder };
};

function resolveContainerStyle(
  state: InputState,
  colors: Record<string, string>,
  dimensions: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: number;
  },
): ViewStyle {
  const base: ViewStyle = {
    minHeight: dimensions.minHeight,
    paddingHorizontal: dimensions.paddingHorizontal,
    paddingVertical: dimensions.paddingVertical,
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
  };

  switch (state) {
    case "default":
      return {
        ...base,
        backgroundColor: colors.inputBackground,
        borderColor: colors.inputBorder,
      };
    case "focused":
      return {
        ...base,
        backgroundColor: colors.inputBackground,
        borderColor: colors.inputBorderFocus,
      };
    case "error":
      return {
        ...base,
        backgroundColor: colors.inputBackground,
        borderColor: colors.inputBorderError,
      };
    case "disabled":
      return {
        ...base,
        backgroundColor: colors.inputDisabledBackground,
        borderColor: colors.inputBorder,
        opacity: 0.5,
      };
  }
}

function resolveInputStyle(
  state: InputState,
  colors: Record<string, string>,
  fontSize: number,
): TextStyle {
  const color =
    state === "disabled"
      ? colors.inputDisabledForeground
      : colors.inputForeground;

  return { fontSize, color };
}
