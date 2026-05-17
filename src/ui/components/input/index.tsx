import {
  BlurEvent,
  FocusEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEvent,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { ReactNode, useCallback, useState } from "react";
import { InputSize, InputState } from "../../types";
import { useGetInputStyles } from "./use-get-input-styles";
import { FormInputFieldProps } from "../../types";

export type InputProps = FormInputFieldProps<string> & Omit<TextInputProps, "onChange"> & {
  containerStyle?: ViewStyle;
  size?: InputSize;
  disabled?: boolean;
  error?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  onTextInputChange?: ((e: TextInputChangeEvent) => void) | undefined
};

export const Input = ({
  size = "md",
  disabled,
  error,
  left,
  right,
  style,
  onFocus,
  onBlur,
  onTextInputChange,
  onChange,
  editable = true,
  containerStyle,
  ...textInputProps
}: InputProps) => {
  const [inputState, setInputState] = useState<InputState>("default");
  const isDisabled = disabled ?? !editable

  const { container, input, placeholder } = useGetInputStyles({
    size,
    inputState,
    disabled: isDisabled,
    error,
  });

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      if (!isDisabled) setInputState("focused");
      onFocus?.(e);
    },
    [isDisabled, onFocus],
  );

  const handleBlur = useCallback(
    (e: BlurEvent) => {
      if (!isDisabled) setInputState("default");
      onBlur?.(e);
    },
    [isDisabled, onBlur],
  );

  const handleOnChange = useCallback(
    (value: string) => {
      onChange?.(value)
    },
    [onChange]
  )

  return (
    <View
      style={StyleSheet.flatten([
        container,
        {
          flexDirection: "row",
          alignItems: "center",
        },
        containerStyle
      ])}
    >
      {left}
      <TextInput
        {...textInputProps}
        editable={!isDisabled}
        placeholderTextColor={textInputProps.placeholderTextColor ?? placeholder.color}
        onFocus={handleFocus}
        onBlur={handleBlur}
        textAlignVertical={textInputProps.textAlignVertical ?? "center"}
        style={StyleSheet.flatten([input, { flex: 1, padding: 0, margin: 0, minHeight: 0, includeFontPadding: false }, style])}
        onChange={onTextInputChange}
        onChangeText={handleOnChange}
      />
      {right}
    </View>
  );
};
