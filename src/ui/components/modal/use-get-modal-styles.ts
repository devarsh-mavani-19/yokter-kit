import { TextStyle, ViewStyle } from "react-native";
import { ModalSize } from "../../types";
import { useTheme } from "../../hooks";
import { modalSizeConfig } from "../../constants";

export type UseGetModalStylesProp = {
  size?: ModalSize;
};

export type UseGetModalStylesReturn = {
  overlay: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  closeButton: ViewStyle;
  closeIconColor: string;
  closeIconSize: number;
  body: ViewStyle;
  footer: ViewStyle;
};

export const useGetModalStyles = ({
  size = "md",
}: UseGetModalStylesProp): UseGetModalStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = modalSizeConfig[size];

  const overlay: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.modalOverlay,
  };

  const container: ViewStyle = {
    width: "90%",
    maxWidth: 480,
    backgroundColor: colors.modalBackground,
    borderRadius: dims.borderRadius,
    borderWidth: 1,
    borderColor: colors.modalBorder,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  };

  const header: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: dims.paddingHorizontal,
    paddingTop: dims.paddingVertical,
    paddingBottom: 12,
  };

  const title: TextStyle = {
    fontSize: dims.titleFontSize,
    fontWeight: "600",
    color: colors.modalHeaderForeground,
    flex: 1,
  };

  const closeButton: ViewStyle = {
    width: dims.closeBtnSize + 8,
    height: dims.closeBtnSize + 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dims.closeBtnSize / 2,
    marginLeft: 8,
  };

  const body: ViewStyle = {
    paddingHorizontal: dims.paddingHorizontal,
    paddingBottom: dims.paddingVertical,
  };

  const footer: ViewStyle = {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: dims.paddingHorizontal,
    paddingBottom: dims.paddingVertical,
  };

  return {
    overlay,
    container,
    header,
    title,
    closeButton,
    closeIconColor: colors.modalForeground,
    closeIconSize: dims.closeBtnSize,
    body,
    footer,
  };
};
