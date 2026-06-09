import { BadgeSize, ButtonSize, CheckboxSize, DropdownSize, FileInputSize, InputSize, ModalSize, OtpInputSize, PaginationSize, RadioSize, RateInputSize, SegmentedControlSize, SliderSize, SwitchSize, TableSize, TextAreaSize, WheelInputSize } from "./types";

export const buttonSizeConfig: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
  sm: { height: 32, paddingHorizontal: 12, fontSize: 13, borderRadius: 6 },
  md: { height: 40, paddingHorizontal: 16, fontSize: 15, borderRadius: 8 },
  lg: { height: 48, paddingHorizontal: 24, fontSize: 17, borderRadius: 10 },
};

export const inputSizeConfig: Record<InputSize, { height: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
  sm: { height: 32, paddingHorizontal: 10, fontSize: 13, borderRadius: 6 },
  md: { height: 40, paddingHorizontal: 12, fontSize: 15, borderRadius: 8 },
  lg: { height: 48, paddingHorizontal: 14, fontSize: 17, borderRadius: 10 },
};

export const checkboxSizeConfig: Record<CheckboxSize, { box: number; borderRadius: number; iconSize: number; gap: number; labelFontSize: number }> = {
  sm: { box: 16, borderRadius: 4, iconSize: 10, gap: 6, labelFontSize: 13 },
  md: { box: 20, borderRadius: 5, iconSize: 12, gap: 8, labelFontSize: 15 },
  lg: { box: 24, borderRadius: 6, iconSize: 14, gap: 10, labelFontSize: 17 },
};

export const radioSizeConfig: Record<RadioSize, { outer: number; dot: number; gap: number; labelFontSize: number }> = {
  sm: { outer: 16, dot: 8, gap: 6, labelFontSize: 13 },
  md: { outer: 20, dot: 10, gap: 8, labelFontSize: 15 },
  lg: { outer: 24, dot: 12, gap: 10, labelFontSize: 17 },
};

export const switchSizeConfig: Record<SwitchSize, { track: { width: number; height: number }; thumb: number; gap: number; labelFontSize: number }> = {
  sm: { track: { width: 28, height: 16 }, thumb: 12, gap: 6, labelFontSize: 13 },
  md: { track: { width: 36, height: 20 }, thumb: 16, gap: 8, labelFontSize: 15 },
  lg: { track: { width: 44, height: 24 }, thumb: 20, gap: 10, labelFontSize: 17 },
};

export const dropdownSizeConfig: Record<DropdownSize, { triggerHeight: number; paddingHorizontal: number; fontSize: number; borderRadius: number; itemHeight: number; maxPanelHeight: number; chevronSize: number }> = {
  sm: { triggerHeight: 32, paddingHorizontal: 10, fontSize: 13, borderRadius: 6, itemHeight: 32, maxPanelHeight: 192, chevronSize: 14 },
  md: { triggerHeight: 40, paddingHorizontal: 12, fontSize: 15, borderRadius: 8, itemHeight: 40, maxPanelHeight: 240, chevronSize: 16 },
  lg: { triggerHeight: 48, paddingHorizontal: 14, fontSize: 17, borderRadius: 10, itemHeight: 48, maxPanelHeight: 288, chevronSize: 18 },
};

export const textAreaSizeConfig: Record<TextAreaSize, { minHeight: number; paddingHorizontal: number; paddingVertical: number; borderRadius: number; fontSize: number; lineHeight: number }> = {
  sm: { minHeight: 64, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, fontSize: 13, lineHeight: 18 },
  md: { minHeight: 80, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, fontSize: 15, lineHeight: 22 },
  lg: { minHeight: 96, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, fontSize: 17, lineHeight: 26 },
};

export const otpInputSizeConfig: Record<OtpInputSize, { cellSize: number; fontSize: number; borderRadius: number; gap: number }> = {
  sm: { cellSize: 36, fontSize: 16, borderRadius: 6, gap: 8 },
  md: { cellSize: 44, fontSize: 20, borderRadius: 8, gap: 10 },
  lg: { cellSize: 52, fontSize: 24, borderRadius: 10, gap: 12 },
};

export const sliderSizeConfig: Record<SliderSize, { trackHeight: number; thumbSize: number }> = {
  sm: { trackHeight: 3, thumbSize: 16 },
  md: { trackHeight: 4, thumbSize: 20 },
  lg: { trackHeight: 5, thumbSize: 24 },
};

export const segmentedControlSizeConfig: Record<SegmentedControlSize, { height: number; paddingHorizontal: number; fontSize: number; borderRadius: number; innerBorderRadius: number; padding: number }> = {
  sm: { height: 32, paddingHorizontal: 12, fontSize: 13, borderRadius: 8, innerBorderRadius: 6, padding: 2 },
  md: { height: 40, paddingHorizontal: 16, fontSize: 15, borderRadius: 10, innerBorderRadius: 8, padding: 3 },
  lg: { height: 48, paddingHorizontal: 20, fontSize: 17, borderRadius: 12, innerBorderRadius: 10, padding: 4 },
};

export const tableSizeConfig: Record<TableSize, { cellPaddingHorizontal: number; cellPaddingVertical: number; headerFontSize: number; cellFontSize: number; borderRadius: number; checkboxSize: number }> = {
  sm: { cellPaddingHorizontal: 10, cellPaddingVertical: 8, headerFontSize: 12, cellFontSize: 13, borderRadius: 6, checkboxSize: 16 },
  md: { cellPaddingHorizontal: 12, cellPaddingVertical: 12, headerFontSize: 13, cellFontSize: 15, borderRadius: 8, checkboxSize: 20 },
  lg: { cellPaddingHorizontal: 16, cellPaddingVertical: 16, headerFontSize: 15, cellFontSize: 17, borderRadius: 10, checkboxSize: 24 },
};

export const badgeSizeConfig: Record<BadgeSize, { paddingHorizontal: number; paddingVertical: number; fontSize: number; borderRadius: number }> = {
  sm: { paddingHorizontal: 6, paddingVertical: 1, fontSize: 11, borderRadius: 9999 },
  md: { paddingHorizontal: 10, paddingVertical: 2, fontSize: 12, borderRadius: 9999 },
  lg: { paddingHorizontal: 14, paddingVertical: 4, fontSize: 14, borderRadius: 9999 },
};

export const rateInputSizeConfig: Record<RateInputSize, { symbolSize: number; spacing: number; fontSize: number }> = {
  sm: { symbolSize: 28, spacing: 6, fontSize: 26 },
  md: { symbolSize: 40, spacing: 8, fontSize: 38 },
  lg: { symbolSize: 52, spacing: 10, fontSize: 50 },
};

export const paginationSizeConfig: Record<PaginationSize, { inputHeight: number; inputMinWidth: number; fontSize: number; borderRadius: number; gap: number; arrowSize: number }> = {
  sm: { inputHeight: 28, inputMinWidth: 36, fontSize: 13, borderRadius: 6, gap: 10, arrowSize: 28 },
  md: { inputHeight: 36, inputMinWidth: 48, fontSize: 15, borderRadius: 8, gap: 14, arrowSize: 36 },
  lg: { inputHeight: 44, inputMinWidth: 56, fontSize: 17, borderRadius: 10, gap: 16, arrowSize: 44 },
};

export const wheelInputSizeConfig: Record<WheelInputSize, { itemHeight: number; fontSize: number; fontSizeActive: number }> = {
  sm: { itemHeight: 36, fontSize: 14, fontSizeActive: 16 },
  md: { itemHeight: 40, fontSize: 16, fontSizeActive: 18 },
  lg: { itemHeight: 44, fontSize: 18, fontSizeActive: 20 },
};

export const modalSizeConfig: Record<ModalSize, { borderRadius: number; paddingHorizontal: number; paddingVertical: number; titleFontSize: number; closeBtnSize: number }> = {
  sm: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 16, titleFontSize: 16, closeBtnSize: 20 },
  md: { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 20, titleFontSize: 18, closeBtnSize: 22 },
  lg: { borderRadius: 14, paddingHorizontal: 24, paddingVertical: 24, titleFontSize: 20, closeBtnSize: 24 },
};

export const fileInputSizeConfig: Record<FileInputSize, { borderRadius: number; padding: number; titleFontSize: number; descriptionFontSize: number; itemHeight: number; itemBorderRadius: number; itemPaddingHorizontal: number; itemFontSize: number; progressHeight: number }> = {
  sm: { borderRadius: 8, padding: 16, titleFontSize: 14, descriptionFontSize: 11, itemHeight: 36, itemBorderRadius: 6, itemPaddingHorizontal: 10, itemFontSize: 12, progressHeight: 3 },
  md: { borderRadius: 10, padding: 24, titleFontSize: 16, descriptionFontSize: 12, itemHeight: 44, itemBorderRadius: 8, itemPaddingHorizontal: 12, itemFontSize: 14, progressHeight: 4 },
  lg: { borderRadius: 12, padding: 32, titleFontSize: 18, descriptionFontSize: 14, itemHeight: 52, itemBorderRadius: 10, itemPaddingHorizontal: 16, itemFontSize: 16, progressHeight: 5 },
};

export const tooltipSizeConfig: Record<"sm" | "md" | "lg", { maxWidth: number; paddingHorizontal: number; paddingVertical: number; fontSize: number; borderRadius: number; arrowSize: number }> = {
  sm: { maxWidth: 180, paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, borderRadius: 4, arrowSize: 6 },
  md: { maxWidth: 240, paddingHorizontal: 10, paddingVertical: 6, fontSize: 13, borderRadius: 6, arrowSize: 7 },
  lg: { maxWidth: 300, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, borderRadius: 8, arrowSize: 8 },
};
