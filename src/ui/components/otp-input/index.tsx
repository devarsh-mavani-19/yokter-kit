import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputKeyPressEvent,
  View,
  ViewStyle,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { OtpInputSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { useGetOtpInputStyles } from "./use-get-otp-input-styles";

export type OtpInputProps = Omit<FormInputFieldProps<string>, "onBlur"> & {
  /** Number of OTP digits. Defaults to 6. */
  length?: number;
  size?: OtpInputSize;
  disabled?: boolean;
  error?: boolean;
  containerStyle?: ViewStyle;
  /** Called when all cells are filled. */
  onComplete?: (code: string) => void;
};

export const OtpInput = ({
  length = 6,
  size = "md",
  disabled,
  error,
  value = "",
  onChange,
  onComplete,
  containerStyle,
}: OtpInputProps) => {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const styles = useGetOtpInputStyles({ size, disabled, error });

  // Pad value to full length, preserving positions. Empty cells are spaces.
  const padded = value.padEnd(length, " ").slice(0, length);
  const digits = padded.split("").map((ch) => (ch === " " ? "" : ch));

  const focusCell = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        refs.current[index]?.focus();
      }
    },
    [length],
  );

  const updateValue = useCallback(
    (newDigits: string[]) => {
      // Use spaces for empty positions to preserve placement
      const positional = newDigits.map((d) => (d === "" ? " " : d)).join("");
      onChange?.(positional);
      const stripped = positional.replace(/ /g, "");
      if (stripped.length === length) {
        onComplete?.(stripped);
      }
    },
    [onChange, onComplete, length],
  );

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      if (disabled) return;

      // Handle paste: user pastes full code
      if (text.length > 1) {
        const pasted = text.replace(/[^0-9]/g, "").slice(0, length);
        const newDigits = pasted.split("");
        while (newDigits.length < length) newDigits.push("");
        updateValue(newDigits);
        focusCell(Math.min(pasted.length, length - 1));
        return;
      }

      const char = text.replace(/[^0-9]/g, "");
      if (char.length === 0) return;

      const wasEmpty = digits[index] === "";
      const newDigits = [...digits];
      newDigits[index] = char;
      updateValue(newDigits);
      // Only advance to next cell if we filled an empty cell
      if (wasEmpty) {
        focusCell(index + 1);
      }
    },
    [disabled, digits, length, updateValue, focusCell],
  );

  const handleKeyPress = useCallback(
    (e: TextInputKeyPressEvent, index: number) => {
      if (disabled) return;
      if (e.nativeEvent.key === "Backspace") {
        const newDigits = [...digits];
        if (digits[index] !== "") {
          newDigits[index] = "";
          updateValue(newDigits);
        } else if (index > 0) {
          newDigits[index - 1] = "";
          updateValue(newDigits);
          focusCell(index - 1);
        }
      }
    },
    [disabled, digits, updateValue, focusCell],
  );

  const handleCellPress = useCallback(
    (index: number) => {
      if (disabled) return;
      focusCell(index);
    },
    [disabled, focusCell],
  );

  return (
    <View
      style={StyleSheet.flatten([
        { flexDirection: "row", gap: styles.gap },
        containerStyle,
      ])}
    >
      {digits.map((digit, index) => {
        const isFocused = focusedIndex === index;
        const cellStyle = styles.getCell({ disabled, error, focused: isFocused });
        return (
          <Pressable key={index} onPress={() => handleCellPress(index)}>
            <View style={cellStyle.container}>
              <TextInput
                ref={(ref) => {
                  refs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
                keyboardType="number-pad"
                maxLength={length}
                editable={!disabled}
                selectTextOnFocus
                caretHidden={!isFocused}
                style={cellStyle.text}
                textAlign="center"
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
