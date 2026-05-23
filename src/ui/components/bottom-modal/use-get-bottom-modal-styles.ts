import { TextStyle, ViewStyle } from "react-native";
import { ModalSize } from "../../types";
import { useTheme } from "../../hooks";
import { modalSizeConfig } from "../../constants";

export type UseGetBottomModalStylesProp = {
  size?: ModalSize;
};

export type UseGetBottomModalStylesReturn = {
  overlayColor: string;
  container: ViewStyle;
  handle: ViewStyle;
  handleBar: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  closeButton: ViewStyle;
  closeIconColor: string;
  closeIconSize: number;
  body: ViewStyle;
  footer: ViewStyle;
};

export const useGetBottomModalStyles = ({
  size = "md",
}: UseGetBottomModalStylesProp): UseGetBottomModalStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = modalSizeConfig[size];

  const overlayColor = colors.modalOverlay;

  const container: ViewStyle = {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: colors.modalBackground,
    borderTopLeftRadius: dims.borderRadius + 4,
    borderTopRightRadius: dims.borderRadius + 4,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.modalBorder,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  };

  const handle: ViewStyle = {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  };

  const handleBar: ViewStyle = {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.modalBorder,
  };

  const header: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: dims.paddingHorizontal,
    paddingTop: 8,
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
    paddingBottom: dims.paddingVertical + 8,
  };

  return {
    overlayColor,
    container,
    handle,
    handleBar,
    header,
    title,
    closeButton,
    closeIconColor: colors.modalForeground,
    closeIconSize: dims.closeBtnSize,
    body,
    footer,
  };
};
