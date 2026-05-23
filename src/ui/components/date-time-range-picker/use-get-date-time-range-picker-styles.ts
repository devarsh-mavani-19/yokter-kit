import { TextStyle, ViewStyle } from "react-native";
import { DateTimeRangePickerSize } from "../../types";
import { useTheme } from "../../hooks";
import { inputSizeConfig } from "../../constants";

export type UseGetDateTimeRangePickerStylesProp = {
  size?: DateTimeRangePickerSize;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  focusedSide?: "start" | "end";
};

const calendarDims: Record<
  DateTimeRangePickerSize,
  {
    cellSize: number;
    navFontSize: number;
    dayFontSize: number;
    headerFontSize: number;
  }
> = {
  sm: { cellSize: 36, navFontSize: 13, dayFontSize: 12, headerFontSize: 11 },
  md: { cellSize: 40, navFontSize: 15, dayFontSize: 14, headerFontSize: 12 },
  lg: { cellSize: 44, navFontSize: 17, dayFontSize: 16, headerFontSize: 13 },
};

export type UseGetDateTimeRangePickerStylesReturn = {
  // Trigger
  trigger: ViewStyle;
  triggerTextStart: TextStyle;
  triggerTextEnd: TextStyle;
  triggerSeparator: ViewStyle;
  placeholder: { color: string };
  icon: { size: number; color: string };
  // Modal
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  // Navigation bar
  navBar: ViewStyle;
  navLabel: TextStyle;
  navArrow: ViewStyle;
  navArrowDisabled: ViewStyle;
  navArrowColor: string;
  navArrowDisabledColor: string;
  // Calendar
  weekdayRow: ViewStyle;
  weekdayText: TextStyle;
  dayCell: ViewStyle;
  dayCellText: TextStyle;
  dayCellToday: ViewStyle;
  dayCellTodayText: TextStyle;
  dayCellSelected: ViewStyle;
  dayCellSelectedText: TextStyle;
  dayCellFiller: TextStyle;
  dayCellDisabled: TextStyle;
  dayCellInRange: ViewStyle;
  dayCellRangeStart: ViewStyle;
  dayCellRangeEnd: ViewStyle;
  cellSize: number;
  // Time picker
  timeContainer: ViewStyle;
  timeColumn: ViewStyle;
  timeItemHeight: number;
  timeVisibleItems: number;
  timeItemText: TextStyle;
  timeItemTextActive: TextStyle;
  timeItemTextFaded: TextStyle;
  timeHighlight: ViewStyle;
  timeSeparator: TextStyle;
  timeLabel: TextStyle;
  // Footer
  footer: ViewStyle;
  footerButtonText: TextStyle;
  footerButtonPrimaryText: TextStyle;
};

export const useGetDateTimeRangePickerStyles = ({
  size = "md",
  disabled,
  error,
  focused,
  focusedSide,
}: UseGetDateTimeRangePickerStylesProp): UseGetDateTimeRangePickerStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const inputDims = inputSizeConfig[size];
  const calDims = calendarDims[size];

  // --- Trigger ---

  const borderColor = disabled
    ? colors.inputBorder
    : error
      ? colors.inputBorderError
      : focused
        ? colors.inputBorderFocus
        : colors.inputBorder;

  const trigger: ViewStyle = {
    height: inputDims.height,
    paddingHorizontal: inputDims.paddingHorizontal,
    borderRadius: inputDims.borderRadius,
    borderWidth: 1,
    borderColor,
    backgroundColor: disabled
      ? colors.inputDisabledBackground
      : colors.inputBackground,
    flexDirection: "row",
    alignItems: "center",
    ...(disabled ? { opacity: 0.5 } : {}),
  };

  const triggerTextBase: TextStyle = {
    fontSize: inputDims.fontSize,
    color: disabled
      ? colors.inputDisabledForeground
      : colors.inputForeground,
  };

  const triggerTextStart: TextStyle = {
    ...triggerTextBase,
    fontWeight: focused && focusedSide === "start" ? "600" : "400",
  };

  const triggerTextEnd: TextStyle = {
    ...triggerTextBase,
    fontWeight: focused && focusedSide === "end" ? "600" : "400",
  };

  const triggerSeparator: ViewStyle = {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  };

  const placeholderColor = colors.inputPlaceholder;
  const iconSize = Math.round(inputDims.fontSize * 1.15);

  // --- Modal ---

  const modalOverlay: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  };

  const panelWidth = calDims.cellSize * 7 + 32;

  const modalContent: ViewStyle = {
    width: panelWidth,
    maxWidth: "90%",
    backgroundColor: colors.baseBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  };

  // --- Navigation bar ---

  const navBar: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  };

  const navLabel: TextStyle = {
    fontSize: calDims.navFontSize,
    fontWeight: "600",
    color: colors.baseForeground,
  };

  const navArrow: ViewStyle = {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  };

  const navArrowDisabled: ViewStyle = {
    opacity: 0.3,
  };

  // --- Calendar ---

  const weekdayRow: ViewStyle = {
    flexDirection: "row",
    marginBottom: 4,
  };

  const weekdayText: TextStyle = {
    width: calDims.cellSize,
    textAlign: "center",
    fontSize: calDims.headerFontSize,
    fontWeight: "500",
    color: colors.inputPlaceholder,
  };

  const dayCell: ViewStyle = {
    width: calDims.cellSize,
    height: calDims.cellSize,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: calDims.cellSize / 2,
  };

  const dayCellText: TextStyle = {
    fontSize: calDims.dayFontSize,
    color: colors.baseForeground,
  };

  const dayCellToday: ViewStyle = {
    borderWidth: 1,
    borderColor: colors.baseBorder,
  };

  const dayCellTodayText: TextStyle = {
    fontWeight: "600",
  };

  const dayCellSelected: ViewStyle = {
    backgroundColor: colors.baseForeground,
  };

  const dayCellSelectedText: TextStyle = {
    color: colors.baseBackground,
    fontWeight: "600",
  };

  const dayCellFiller: TextStyle = {
    color: colors.inputPlaceholder,
  };

  const dayCellDisabled: TextStyle = {
    color: colors.baseBorder,
  };

  // Range-specific calendar styles
  const dayCellInRange: ViewStyle = {
    backgroundColor:
      colorMode === "light"
        ? "rgba(24, 24, 27, 0.08)"
        : "rgba(250, 250, 250, 0.08)",
    borderRadius: 0,
  };

  const dayCellRangeStart: ViewStyle = {
    backgroundColor: colors.baseForeground,
    borderTopLeftRadius: calDims.cellSize / 2,
    borderBottomLeftRadius: calDims.cellSize / 2,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  };

  const dayCellRangeEnd: ViewStyle = {
    backgroundColor: colors.baseForeground,
    borderTopRightRadius: calDims.cellSize / 2,
    borderBottomRightRadius: calDims.cellSize / 2,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  };

  // --- Time picker ---

  const timeItemHeight = calDims.cellSize;
  const timeVisibleItems = 5;

  const timeContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  };

  const timeColumn: ViewStyle = {
    width: 56,
    height: timeItemHeight * timeVisibleItems,
    overflow: "hidden",
  };

  const timeItemText: TextStyle = {
    fontSize: calDims.navFontSize + 2,
    fontWeight: "400",
    color: colors.inputPlaceholder,
    textAlign: "center",
    lineHeight: timeItemHeight,
    height: timeItemHeight,
  };

  const timeItemTextActive: TextStyle = {
    fontSize: calDims.navFontSize + 4,
    fontWeight: "600",
    color: colors.baseForeground,
  };

  const timeItemTextFaded: TextStyle = {
    opacity: 0.3,
  };

  const timeHighlight: ViewStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    top: timeItemHeight * Math.floor(timeVisibleItems / 2),
    height: timeItemHeight,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.baseBorder,
  };

  const timeSeparator: TextStyle = {
    fontSize: calDims.navFontSize + 6,
    fontWeight: "700",
    color: colors.baseForeground,
    paddingHorizontal: 4,
  };

  const timeLabel: TextStyle = {
    fontSize: calDims.navFontSize,
    fontWeight: "500",
    color: colors.baseForeground,
    textAlign: "center",
    marginBottom: 4,
  };

  // --- Footer ---

  const footer: ViewStyle = {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
    gap: 16,
  };

  const footerButtonText: TextStyle = {
    fontSize: calDims.navFontSize,
    fontWeight: "500",
    color: colors.inputPlaceholder,
  };

  const footerButtonPrimaryText: TextStyle = {
    fontSize: calDims.navFontSize,
    fontWeight: "600",
    color: colors.baseForeground,
  };

  return {
    trigger,
    triggerTextStart,
    triggerTextEnd,
    triggerSeparator,
    placeholder: { color: placeholderColor },
    icon: { size: iconSize, color: placeholderColor },
    modalOverlay,
    modalContent,
    navBar,
    navLabel,
    navArrow,
    navArrowDisabled,
    navArrowColor: colors.baseForeground,
    navArrowDisabledColor: colors.inputPlaceholder,
    weekdayRow,
    weekdayText,
    dayCell,
    dayCellText,
    dayCellToday,
    dayCellTodayText,
    dayCellSelected,
    dayCellSelectedText,
    dayCellFiller,
    dayCellDisabled,
    dayCellInRange,
    dayCellRangeStart,
    dayCellRangeEnd,
    cellSize: calDims.cellSize,
    timeContainer,
    timeColumn,
    timeItemHeight,
    timeVisibleItems,
    timeItemText,
    timeItemTextActive,
    timeItemTextFaded,
    timeHighlight,
    timeSeparator,
    timeLabel,
    footer,
    footerButtonText,
    footerButtonPrimaryText,
  };
};
