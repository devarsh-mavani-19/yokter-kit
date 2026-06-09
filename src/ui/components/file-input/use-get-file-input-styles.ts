import { TextStyle, ViewStyle } from "react-native";
import { FileInputSize } from "../../types";
import { useTheme } from "../../hooks";
import { fileInputSizeConfig } from "../../constants";

export type UseGetFileInputStylesProp = {
  size?: FileInputSize;
  disabled?: boolean;
  error?: boolean;
};

export type UseGetFileInputStylesReturn = {
  dropzone: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  item: ViewStyle;
  itemText: TextStyle;
  progressTrack: ViewStyle;
  progressFill: ViewStyle;
  errorText: TextStyle;
  removeButton: TextStyle;
};

export const useGetFileInputStyles = ({
  size = "md",
  disabled,
  error,
}: UseGetFileInputStylesProp): UseGetFileInputStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dimensions = fileInputSizeConfig[size];

  const dropzone: ViewStyle = {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: error
      ? colors.fileInputErrorForeground
      : colors.fileInputBorderDashed,
    borderRadius: dimensions.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    padding: dimensions.padding,
    backgroundColor: disabled
      ? colors.fileInputDisabledBackground
      : colors.fileInputBackground,
    opacity: disabled ? 0.6 : 1,
  };

  const title: TextStyle = {
    fontSize: dimensions.titleFontSize,
    fontWeight: "600",
    color: disabled
      ? colors.fileInputDisabledForeground
      : colors.fileInputForeground,
    textAlign: "center",
    marginBottom: 4,
  };

  const description: TextStyle = {
    fontSize: dimensions.descriptionFontSize,
    color: disabled
      ? colors.fileInputDisabledForeground
      : colors.fileInputForegroundSub,
    textAlign: "center",
    marginBottom: 12,
  };

  const item: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    height: dimensions.itemHeight,
    borderRadius: dimensions.itemBorderRadius,
    paddingHorizontal: dimensions.itemPaddingHorizontal,
    backgroundColor: colors.fileInputItemBackground,
    borderWidth: 1,
    borderColor: colors.fileInputItemBorder,
    marginTop: 8,
    width: "100%",
  };

  const itemText: TextStyle = {
    fontSize: dimensions.itemFontSize,
    color: colors.fileInputItemForeground,
    flex: 1,
  };

  const progressTrack: ViewStyle = {
    height: dimensions.progressHeight,
    backgroundColor: colors.fileInputProgressTrack,
    borderRadius: dimensions.progressHeight / 2,
    overflow: "hidden",
    marginTop: 8,
    width: "100%",
  };

  const progressFill: ViewStyle = {
    height: "100%",
    backgroundColor: colors.fileInputProgressFill,
    borderRadius: dimensions.progressHeight / 2,
  };

  const errorText: TextStyle = {
    fontSize: dimensions.descriptionFontSize,
    color: colors.fileInputErrorForeground,
    marginTop: 4,
  };

  const removeButton: TextStyle = {
    fontSize: dimensions.itemFontSize,
    color: colors.fileInputRemoveForeground,
  };

  return {
    dropzone,
    title,
    description,
    item,
    itemText,
    progressTrack,
    progressFill,
    errorText,
    removeButton,
  };
};
