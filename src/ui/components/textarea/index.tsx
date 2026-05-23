// Auto-grow approach inspired by react-autosize-textarea by buildo
// https://github.com/buildo/react-autosize-textarea (MIT)
import {
  BlurEvent,
  FocusEvent,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEvent,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { useCallback, useState } from "react";
import { InputState, TextAreaSize } from "../../types";
import { useGetTextAreaStyles } from "./use-get-textarea-styles";
import { FormInputFieldProps } from "../../types";
import { textAreaSizeConfig } from "../../constants";

export type TextAreaProps = FormInputFieldProps<string> &
  Omit<TextInputProps, "onChange" | "multiline"> & {
    containerStyle?: ViewStyle;
    size?: TextAreaSize;
    disabled?: boolean;
    error?: boolean;
    /** Minimum number of visible rows. Defaults to 3. */
    rows?: number;
    /** Maximum number of visible rows. When content exceeds this, scrolling is enabled. */
    maxRows?: number;
  };

export const TextArea = ({
  size = "md",
  disabled,
  error,
  style,
  onFocus,
  onBlur,
  onChange,
  editable = true,
  containerStyle,
  rows = 3,
  maxRows,
  ...textInputProps
}: TextAreaProps) => {
  const [inputState, setInputState] = useState<InputState>("default");
  const isDisabled = disabled ?? !editable;
  const dims = textAreaSizeConfig[size];

  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  );

  const { container, input, placeholder } = useGetTextAreaStyles({
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
      onChange?.(value);
    },
    [onChange],
  );

  const handleContentSizeChange = useCallback(
    (e: TextInputContentSizeChangeEvent) => {
      setContentHeight(e.nativeEvent.contentSize.height);
    },
    [],
  );

  const minRowHeight = rows * dims.lineHeight;
  const maxRowHeight = maxRows != null ? maxRows * dims.lineHeight : undefined;

  const innerHeight =
    contentHeight != null ? Math.max(contentHeight, minRowHeight) : minRowHeight;

  const clampedHeight =
    maxRowHeight != null ? Math.min(innerHeight, maxRowHeight) : innerHeight;

  const totalHeight = clampedHeight + dims.paddingVertical * 2;

  const shouldScroll =
    maxRowHeight != null && contentHeight != null && contentHeight > maxRowHeight;

  return (
    <View
      style={StyleSheet.flatten([
        container,
        { height: totalHeight, minHeight: undefined },
        containerStyle,
      ])}
    >
      <TextInput
        {...textInputProps}
        multiline
        editable={!isDisabled}
        placeholderTextColor={
          textInputProps.placeholderTextColor ?? placeholder.color
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        textAlignVertical="top"
        onContentSizeChange={handleContentSizeChange}
        scrollEnabled={shouldScroll}
        style={StyleSheet.flatten([
          input,
          {
            height: clampedHeight,
            padding: 0,
            margin: 0,
            includeFontPadding: false,
            lineHeight: dims.lineHeight,
          },
          style,
        ])}
        onChangeText={handleOnChange}
      />
    </View>
  );
};
