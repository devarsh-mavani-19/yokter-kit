import { TextStyle, ViewStyle } from "react-native";
import { InputSize, InputState } from "../../types";
import { useTheme } from "../../hooks";
import { inputSizeConfig } from "../../constants";

export type UseGetInputStylesProp = {
  size?: InputSize;
  inputState?: InputState;
  disabled?: boolean;
  error?: boolean;
};

export type UseGetInputStylesReturn = {
  container: ViewStyle;
  input: TextStyle;
  placeholder: { color: string };
};

export const useGetInputStyles = ({
  size = "md",
  inputState = "default",
  disabled,
  error,
}: UseGetInputStylesProp): UseGetInputStylesReturn => {
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

  const dimensions = inputSizeConfig[size];

  const container = resolveContainerStyle(effectiveState, colors, dimensions);
  const input = resolveInputStyle(effectiveState, colors, dimensions.fontSize);
  const placeholder = { color: colors.inputPlaceholder };

  return { container, input, placeholder };
};

function resolveContainerStyle(
  state: InputState,
  colors: Record<string, string>,
  dimensions: {
    height: number;
    paddingHorizontal: number;
    borderRadius: number;
  },
): ViewStyle {
  const base: ViewStyle = {
    height: dimensions.height,
    paddingHorizontal: dimensions.paddingHorizontal,
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
