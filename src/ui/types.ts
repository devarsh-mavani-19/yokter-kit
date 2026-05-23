import { TextStyle } from "react-native";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type FormInputFieldProps<T> = {
  onBlur?: () => void;
  onChange?: (value: T) => void;
  value?: T;
  errorMessage?: string;
};

export type ColorMode = "light" | "dark";

export type FontWeight =
  | "thin"
  | "extraLight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extraBold"
  | "black"
  | "italic";

export type SpacingSize = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type RadiusSize = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type ShadowType = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ZIndexType =
  | "base"
  | "raised"
  | "dropdown"
  | "sticky"
  | "overlay"
  | "modal"
  | "toast";

export type SizeScale = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type LineHeightSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "xxxxl"
  | "xxxxxl";

export type LetterSpacingSize =
  | "tighter"
  | "tight"
  | "normal"
  | "wide"
  | "wider";

export type ColorSemanticToken =
  // Base
  | "baseBackground"
  | "baseForeground"
  | "baseBorder"
  // Button
  | "buttonBorder"
  | "buttonBackground"
  | "buttonForeground"
  | "buttonBackgroundHover"
  | "buttonBackgroundActive"
  | "buttonAccent"
  | "buttonAccentForeground"
  | "buttonDisabledBackground"
  | "buttonDisabledForeground"
  // Button - Danger
  | "buttonDangerBorder"
  | "buttonDangerBackground"
  | "buttonDangerForeground"
  | "buttonDangerBackgroundHover"
  | "buttonDangerBackgroundActive"
  | "buttonDangerAccent"
  | "buttonDangerAccentForeground"
  | "buttonDangerDisabledBackground"
  | "buttonDangerDisabledForeground"
  // Input
  | "inputBackground"
  | "inputForeground"
  | "inputBorder"
  | "inputBorderFocus"
  | "inputRingFocus"
  | "inputPlaceholder"
  | "inputBorderError"
  | "inputRingError"
  | "inputDisabledBackground"
  | "inputDisabledForeground"
  // Checkbox
  | "checkboxBackground"
  | "checkboxForeground"
  | "checkboxBorder"
  | "checkboxCheckedBackground"
  | "checkboxCheckedForeground"
  | "checkboxCheckedBorder"
  | "checkboxDisabledBackground"
  | "checkboxDisabledForeground"
  | "checkboxDisabledBorder"
  | "checkboxLabel"
  | "checkboxLabelDisabled"
  // Radio
  | "radioBorder"
  | "radioBackground"
  | "radioSelectedBorder"
  | "radioSelectedDot"
  | "radioDisabledBorder"
  | "radioDisabledBackground"
  | "radioDisabledDot"
  | "radioLabel"
  | "radioLabelDisabled"
  // Switch
  | "switchTrack"
  | "switchTrackActive"
  | "switchThumb"
  | "switchThumbActive"
  | "switchTrackDisabled"
  | "switchThumbDisabled"
  | "switchLabel"
  | "switchLabelDisabled"
  // Dropdown
  | "dropdownTriggerBackground"
  | "dropdownTriggerForeground"
  | "dropdownTriggerBorder"
  | "dropdownTriggerBorderFocus"
  | "dropdownTriggerPlaceholder"
  | "dropdownTriggerDisabledBackground"
  | "dropdownTriggerDisabledForeground"
  | "dropdownTriggerDisabledBorder"
  | "dropdownPanelBackground"
  | "dropdownPanelBorder"
  | "dropdownItemForeground"
  | "dropdownItemBackgroundActive"
  | "dropdownItemForegroundActive"
  | "dropdownItemBackgroundHover"
  // Slider
  | "sliderTrack"
  | "sliderFill"
  | "sliderThumb"
  | "sliderThumbBorder"
  | "sliderTrackDisabled"
  | "sliderFillDisabled"
  | "sliderThumbDisabled"
  // SegmentedControl
  | "segmentedBackground"
  | "segmentedItemBackground"
  | "segmentedItemBackgroundActive"
  | "segmentedItemForeground"
  | "segmentedItemForegroundActive"
  | "segmentedBorder"
  | "segmentedDisabledBackground"
  | "segmentedDisabledForeground"
  // Table
  | "tableHeaderBackground"
  | "tableHeaderForeground"
  | "tableRowBackground"
  | "tableRowBackgroundAlt"
  | "tableRowForeground"
  | "tableRowBackgroundHover"
  | "tableBorder"
  | "tableSortIcon"
  | "tableSortIconActive"
  | "tableEmptyForeground"
  | "tableDisabledForeground"
  // Pagination
  | "paginationForeground"
  | "paginationInputBackground"
  | "paginationInputBorder"
  | "paginationInputForeground"
  | "paginationArrowForeground"
  | "paginationDisabledForeground"
  // Badge
  | "badgeDefaultBackground"
  | "badgeDefaultForeground"
  | "badgeDefaultBorder"
  | "badgeSecondaryBackground"
  | "badgeSecondaryForeground"
  | "badgeSecondaryBorder"
  | "badgeDestructiveBackground"
  | "badgeDestructiveForeground"
  | "badgeDestructiveBorder"
  | "badgeOutlineBackground"
  | "badgeOutlineForeground"
  | "badgeOutlineBorder"
  // RateInput
  | "rateInputFill"
  | "rateInputBase"
  | "rateInputHover"
  | "rateInputDisabled"
  // WheelInput
  | "wheelInputForeground"
  | "wheelInputForegroundActive"
  | "wheelInputForegroundFaded"
  | "wheelInputHighlightBorder"
  | "wheelInputDisabledForeground"
  // Modal
  | "modalOverlay"
  | "modalBackground"
  | "modalForeground"
  | "modalBorder"
  | "modalHeaderForeground"
  // Tooltip
  | "tooltipBackground"
  | "tooltipForeground";

export type TypographyVariant =
  | "display1"
  | "display2"
  | "display3"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "body3"
  | "body4"
  | "caption1"
  | "caption2"
  | "caption3"
  | "label"
  | "button"
  | "overline"
  | "code";

export type TypographyVariantStyle = {
  lineHeight: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: TextStyle["fontWeight"];
  letterSpacing: number;
};

export type ButtonVariant = "solid" | "outlined";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonState = "default" | "hover" | "press" | "disabled";

export type InputSize = "sm" | "md" | "lg";

export type InputState = "default" | "focused" | "disabled" | "error";

export type CheckboxSize = "sm" | "md" | "lg";

export type CheckboxState = "unchecked" | "checked" | "indeterminate";

export type RadioSize = "sm" | "md" | "lg";

export type SwitchSize = "sm" | "md" | "lg";

export type DropdownSize = "sm" | "md" | "lg";

export type TextAreaSize = "sm" | "md" | "lg";

export type OtpInputSize = "sm" | "md" | "lg";

export type SliderSize = "sm" | "md" | "lg";

export type SegmentedControlSize = "sm" | "md" | "lg";

export type PaginationSize = "sm" | "md" | "lg";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export type BadgeSize = "sm" | "md" | "lg";

export type DateTimePickerSize = "sm" | "md" | "lg";

export type DateTimePickerMode = "date" | "time" | "datetime";

export type DateTimeRangePickerSize = "sm" | "md" | "lg";

export type DateTimeRangePickerMode = "date" | "time" | "datetime";

export type DateTimeRangeValue = {
  start?: import("luxon").DateTime;
  end?: import("luxon").DateTime;
};

export type RateInputSize = "sm" | "md" | "lg";

export type WheelInputSize = "sm" | "md" | "lg";

export type TableSize = "sm" | "md" | "lg";

export type ModalSize = "sm" | "md" | "lg";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type ButtonStyle = {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  iconSize: number;
  gap: number;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  background: string;
  foreground: string;
  border: string;
};

export type ButtonTheme = {
  solid: ButtonSizeToState;
  outlined: ButtonSizeToState;
};

export type ButtonSizeToState = {
  sm: ButtonStateToStyle;
  md: ButtonStateToStyle;
  lg: ButtonStateToStyle;
};

export type ButtonStateToStyle = {
  default: ButtonStyle;
  press: ButtonStyle;
  disabled: ButtonStyle;
};

export type ThemeConfig = {
  font: Record<FontWeight, string>;
  lightModeColorSemantic: Record<ColorSemanticToken, string>;
  darkModeColorSemantic: Record<ColorSemanticToken, string>;
  spacing: Record<SpacingSize, number>;
  radius: Record<RadiusSize, number>;
  shadow: Record<ShadowType, ShadowStyle>;
  typography: Record<TypographyVariant, TypographyVariantStyle>;
};
