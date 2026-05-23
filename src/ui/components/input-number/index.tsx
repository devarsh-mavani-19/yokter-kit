import {
  BlurEvent,
  FocusEvent,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { InputSize, InputState } from "../../types";
import { useGetInputStyles } from "../input/use-get-input-styles";
import { FormInputFieldProps } from "../../types";
import {
  getDecimalSeparator,
  formatNumber,
  parseNumber,
} from "../../utils/decimal";

export type InputNumberProps = Omit<FormInputFieldProps<number>, "onChange"> & {
  onChange?: (value: number | undefined) => void;
} & Omit<TextInputProps, "onChange" | "value" | "keyboardType"> & {
    containerStyle?: ViewStyle;
    size?: InputSize;
    disabled?: boolean;
    error?: boolean;
    left?: ReactNode;
    right?: ReactNode;
    decimalScale?: number;
    locale?: string;
  };

export const InputNumber = ({
  size = "md",
  disabled,
  error,
  left,
  right,
  style,
  onFocus,
  onBlur,
  onChange,
  value,
  editable = true,
  containerStyle,
  decimalScale = 2,
  locale,
  ...textInputProps
}: InputNumberProps) => {
  const [inputState, setInputState] = useState<InputState>("default");
  const isDisabled = disabled ?? !editable;

  const decimalSeparator = useMemo(() => getDecimalSeparator(locale), [locale]);

  const isFocusedRef = useRef(false);
  const [editingText, setEditingText] = useState<string | null>(null);

  const displayText = useMemo(() => {
    if (typeof value === "number" && !isNaN(value)) {
      return formatNumber(value, decimalScale, decimalSeparator);
    }
    return "";
  }, [value, decimalScale, decimalSeparator]);

  const internalText = editingText ?? displayText;

  const { container, input, placeholder } = useGetInputStyles({
    size,
    inputState,
    disabled: isDisabled,
    error,
  });

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      if (!isDisabled) {
        isFocusedRef.current = true;
        setInputState("focused");
        setEditingText(internalText);
      }
      onFocus?.(e);
    },
    [isDisabled, onFocus, internalText],
  );

  const handleBlur = useCallback(
    (_e: BlurEvent) => {
      isFocusedRef.current = false;
      if (!isDisabled) setInputState("default");

      const currentText = editingText ?? "";

      const separatorRegex = new RegExp(`\\${decimalSeparator}`, "g");
      const separatorCount = (currentText.match(separatorRegex) ?? []).length;

      if (currentText.trim() === "") {
        onChange?.(undefined);
        setEditingText(null);
        onBlur?.();
        return;
      }

      if (separatorCount > 1) {
        setEditingText(null);
        onBlur?.();
        return;
      }

      const parsed = parseNumber(currentText, decimalSeparator);

      if (parsed !== null) {
        onChange?.(parsed);
      }

      setEditingText(null);
      onBlur?.();
    },
    [isDisabled, editingText, decimalSeparator, onChange, onBlur],
  );

  const handleChangeText = useCallback((text: string) => {
    setEditingText(text);
  }, []);

  return (
    <View
      style={StyleSheet.flatten([
        container,
        {
          flexDirection: "row",
          alignItems: "center",
        },
        containerStyle,
      ])}
    >
      {left}
      <TextInput
        {...textInputProps}
        value={internalText}
        editable={!isDisabled}
        placeholderTextColor={
          textInputProps.placeholderTextColor ?? placeholder.color
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        textAlignVertical={textInputProps.textAlignVertical ?? "center"}
        style={StyleSheet.flatten([
          input,
          {
            flex: 1,
            padding: 0,
            margin: 0,
            minHeight: 0,
            includeFontPadding: false,
          },
          style,
        ])}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
        autoCorrect={false}
      />
      {right}
    </View>
  );
};
