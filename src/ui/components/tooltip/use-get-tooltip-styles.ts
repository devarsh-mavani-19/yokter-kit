import { TextStyle, ViewStyle } from "react-native";
import { TooltipPlacement } from "../../types";
import { useTheme } from "../../hooks";
import { tooltipSizeConfig } from "../../constants";

export type UseGetTooltipStylesProp = {
  size?: "sm" | "md" | "lg";
  placement?: TooltipPlacement;
};

export type UseGetTooltipStylesReturn = {
  tooltipContainer: ViewStyle;
  tooltip: ViewStyle;
  tooltipText: TextStyle;
  arrow: ViewStyle;
  arrowSize: number;
  backgroundColor: string;
};

export const useGetTooltipStyles = ({
  size = "md",
  placement = "top",
}: UseGetTooltipStylesProp): UseGetTooltipStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dims = tooltipSizeConfig[size];

  const tooltipContainer: ViewStyle = {
    position: "absolute",
    alignItems: "center",
    ...(placement === "top" && { bottom: "100%", left: "50%", marginBottom: dims.arrowSize }),
    ...(placement === "bottom" && { top: "100%", left: "50%", marginTop: dims.arrowSize }),
    ...(placement === "left" && { right: "100%", top: "50%", marginRight: dims.arrowSize }),
    ...(placement === "right" && { left: "100%", top: "50%", marginLeft: dims.arrowSize }),
  };

  const tooltip: ViewStyle = {
    maxWidth: dims.maxWidth,
    paddingHorizontal: dims.paddingHorizontal,
    paddingVertical: dims.paddingVertical,
    backgroundColor: colors.tooltipBackground,
    borderRadius: dims.borderRadius,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    ...(placement === "top" || placement === "bottom"
      ? { transform: [{ translateX: "-50%" }] }
      : { transform: [{ translateY: "-50%" }] }),
  };

  const tooltipText: TextStyle = {
    fontSize: dims.fontSize,
    color: colors.tooltipForeground,
    textAlign: "center",
  };

  const arrowBase: ViewStyle = {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  };

  const a = dims.arrowSize;
  let arrow: ViewStyle;

  switch (placement) {
    case "top":
      arrow = {
        ...arrowBase,
        bottom: -a,
        alignSelf: "center",
        borderLeftWidth: a,
        borderRightWidth: a,
        borderTopWidth: a,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: colors.tooltipBackground,
      };
      break;
    case "bottom":
      arrow = {
        ...arrowBase,
        top: -a,
        alignSelf: "center",
        borderLeftWidth: a,
        borderRightWidth: a,
        borderBottomWidth: a,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: colors.tooltipBackground,
      };
      break;
    case "left":
      arrow = {
        ...arrowBase,
        right: -a,
        top: "50%",
        marginTop: -a,
        borderTopWidth: a,
        borderBottomWidth: a,
        borderLeftWidth: a,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: colors.tooltipBackground,
      };
      break;
    case "right":
      arrow = {
        ...arrowBase,
        left: -a,
        top: "50%",
        marginTop: -a,
        borderTopWidth: a,
        borderBottomWidth: a,
        borderRightWidth: a,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: colors.tooltipBackground,
      };
      break;
  }

  return {
    tooltipContainer,
    tooltip,
    tooltipText,
    arrow,
    arrowSize: dims.arrowSize,
    backgroundColor: colors.tooltipBackground,
  };
};
