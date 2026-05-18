import { ButtonSize, CheckboxSize, InputSize, RadioSize, SwitchSize } from "./types";

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
