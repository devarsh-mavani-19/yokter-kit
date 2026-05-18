// Provider
export { ThemeProvider } from "./context/theme.context";

// Hooks
export { useTheme } from "./hooks";
export { useGetButtonStyles as useButtonStylesResolver } from "./components/button/use-get-button-theme";
export type {
  UseGetButtonStylesProp as UseButtonStylesProp,
  UseGetButtonStylesReturn as UseButtonStyleReturn,
} from "./components/button/use-get-button-theme";
export { Button } from "./components/button";
export type { ButtonProps } from "./components/button";
export { Typography } from "./components/typography";
export type { TypographyProps } from "./components/typography";
export { useGetTypographyStyles } from "./components/typography/use-get-typography-styles";
export type {
  UseGetTypographyStylesProp,
  UseGetTypographyStylesReturn,
} from "./components/typography/use-get-typography-styles";
export { Input } from "./components/input";
export type { InputProps } from "./components/input";
export { InputNumber } from "./components/input-number";
export type { InputNumberProps } from "./components/input-number";
export { Checkbox } from "./components/checkbox";
export type { CheckboxProps } from "./components/checkbox";
export { useGetCheckboxStyles } from "./components/checkbox/use-get-checkbox-styles";
export type {
  UseGetCheckboxStylesProp,
  UseGetCheckboxStylesReturn,
} from "./components/checkbox/use-get-checkbox-styles";
export { Radio, RadioGroup } from "./components/radio";
export type { RadioProps, RadioGroupProps } from "./components/radio";
export { useGetRadioStyles } from "./components/radio/use-get-radio-styles";
export type {
  UseGetRadioStylesProp,
  UseGetRadioStylesReturn,
} from "./components/radio/use-get-radio-styles";
export { Switch } from "./components/switch";
export type { SwitchProps } from "./components/switch";
export { useGetSwitchStyles } from "./components/switch/use-get-switch-styles";
export type {
  UseGetSwitchStylesProp,
  UseGetSwitchStylesReturn,
} from "./components/switch/use-get-switch-styles";
export { Dropdown } from "./components/dropdown";
export type { DropdownProps, DropdownSingleProps, DropdownMultiProps, DropdownOption } from "./components/dropdown";
export { useGetDropdownStyles } from "./components/dropdown/use-get-dropdown-styles";
export type {
  UseGetDropdownStylesProp,
  UseGetDropdownStylesReturn,
} from "./components/dropdown/use-get-dropdown-styles";
export { AutoComplete } from "./components/autocomplete";
export type { AutoCompleteProps, AutoCompleteOption } from "./components/autocomplete";
export { OtpInput } from "./components/otp-input";
export type { OtpInputProps } from "./components/otp-input";
export { useGetOtpInputStyles } from "./components/otp-input/use-get-otp-input-styles";
export type {
  UseGetOtpInputStylesProp,
  UseGetOtpInputStylesReturn,
} from "./components/otp-input/use-get-otp-input-styles";
export { Slider } from "./components/slider";
export type { SliderProps } from "./components/slider";
export { useGetSliderStyles } from "./components/slider/use-get-slider-styles";
export type {
  UseGetSliderStylesProp,
  UseGetSliderStylesReturn,
} from "./components/slider/use-get-slider-styles";
export { SegmentedControl } from "./components/segmented-control";
export type { SegmentedControlProps, SegmentedControlSingleProps, SegmentedControlMultiProps, SegmentedControlOption } from "./components/segmented-control";
export { useGetSegmentedControlStyles } from "./components/segmented-control/use-get-segmented-control-styles";
export type {
  UseGetSegmentedControlStylesProp,
  UseGetSegmentedControlStylesReturn,
} from "./components/segmented-control/use-get-segmented-control-styles";
export { useGetInputStyles } from "./components/input/use-get-input-styles";
export type {
  UseGetInputStylesProp,
  UseGetInputStylesReturn,
} from "./components/input/use-get-input-styles";
export { TextArea } from "./components/textarea";
export type { TextAreaProps } from "./components/textarea";
export { useGetTextAreaStyles } from "./components/textarea/use-get-textarea-styles";
export type {
  UseGetTextAreaStylesProp,
  UseGetTextAreaStylesReturn,
} from "./components/textarea/use-get-textarea-styles";

// Theme creation
export { createTheme, defaultTheme } from "./createTheme";

// Primitives (for direct access)
export { darkModeColorSemantic } from "./configs/blackWhite/darkModeColorSemantic";
export { lightModeColorSemantic } from "./configs/blackWhite/lightModeColorSemantic";
export { spacing } from "./configs/blackWhite/spacing";
export { radius } from "./configs/blackWhite/radius";
export { shadow as shadows } from "./configs/blackWhite/shadows";
export { zIndex } from "./configs/blackWhite/zIndex";
export {
  lineHeights,
  letterSpacings,
  typography,
} from "./configs/blackWhite/typography";

// Types
export type {
  ThemeConfig,
  ColorMode,
  FontWeight,
  SpacingSize,
  RadiusSize,
  ShadowType,
  ShadowStyle,
  ZIndexType,
  SizeScale,
  LineHeightSize,
  LetterSpacingSize,
  ColorSemanticToken,
  TypographyVariant,
  TypographyVariantStyle,
  ButtonVariant,
  ButtonSize,
  ButtonState,
  ButtonStyle,
  ButtonTheme,
  ButtonSizeToState,
  ButtonStateToStyle,
  InputSize,
  InputState,
  CheckboxSize,
  CheckboxState,
  RadioSize,
  SwitchSize,
  DropdownSize,
  TextAreaSize,
  OtpInputSize,
  SliderSize,
  SegmentedControlSize,
  DeepPartial,
  FormInputFieldProps,
} from "./types";
