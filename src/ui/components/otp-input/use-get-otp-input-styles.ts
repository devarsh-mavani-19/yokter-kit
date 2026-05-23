import { TextStyle, ViewStyle } from "react-native";
import { OtpInputSize } from "../../types";
import { useTheme } from "../../hooks";
import { otpInputSizeConfig } from "../../constants";

export type UseGetOtpInputStylesProp = {
  size?: OtpInputSize;
  disabled?: boolean;
  error?: boolean;
};

export type OtpCellStyleInput = {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
};

export type OtpCellStyle = {
  container: ViewStyle;
  text: TextStyle;
};

export type UseGetOtpInputStylesReturn = {
  gap: number;
  getCell: (input: OtpCellStyleInput) => OtpCellStyle;
};

export const useGetOtpInputStyles = ({
  size = "md",
  disabled,
  error,
}: UseGetOtpInputStylesProp): UseGetOtpInputStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = otpInputSizeConfig[size];

  const getCell = (input: OtpCellStyleInput): OtpCellStyle => {
    const isDisabled = disabled ?? input.disabled;
    const isError = error ?? input.error;
    const isFocused = input.focused;

    const borderWidth = isFocused ? 2 : 1;

    const container: ViewStyle = {
      width: dims.cellSize,
      height: dims.cellSize,
      borderRadius: dims.borderRadius,
      borderWidth,
      alignItems: "center",
      justifyContent: "center",
    };

    const text: TextStyle = {
      fontSize: dims.fontSize,
      padding: 0,
      margin: 0,
      width: dims.cellSize - borderWidth * 2,
      height: dims.cellSize - borderWidth * 2,
      textAlignVertical: "center",
      includeFontPadding: false,
    };

    if (isDisabled) {
      return {
        container: { ...container, backgroundColor: colors.inputDisabledBackground, borderColor: colors.inputBorder, opacity: 0.5 },
        text: { ...text, color: colors.inputDisabledForeground },
      };
    }

    if (isError) {
      return {
        container: { ...container, backgroundColor: colors.inputBackground, borderColor: colors.inputBorderError },
        text: { ...text, color: colors.inputForeground },
      };
    }

    if (isFocused) {
      return {
        container: { ...container, backgroundColor: colors.inputBackground, borderColor: colors.inputBorderFocus },
        text: { ...text, color: colors.inputForeground },
      };
    }

    return {
      container: { ...container, backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
      text: { ...text, color: colors.inputForeground },
    };
  };

  return { gap: dims.gap, getCell };
};
