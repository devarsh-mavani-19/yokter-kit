import { ButtonSize, InputSize } from "./types";

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
