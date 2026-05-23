import { ReactNode, useCallback } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RateInputSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { useGetRateInputStyles } from "./use-get-rate-input-styles";
import { StarIcon } from "./star-icon";
import { rateInputSizeConfig } from "../../constants";

export type RateInputProps = Omit<FormInputFieldProps<number>, "errorMessage"> & {
  size?: RateInputSize;
  /** Total number of symbols to display. Defaults to 5. */
  maxRating?: number;
  disabled?: boolean;
  /** Array of emoji strings (one per rating level) or a single emoji for all levels. */
  emojis?: string | string[];
  /** Custom render function for each symbol. Receives index (0-based) and whether it's filled. */
  renderSymbol?: (index: number, filled: boolean) => ReactNode;
  containerStyle?: ViewStyle;
};

export const RateInput = ({
  size = "md",
  maxRating = 5,
  disabled,
  emojis,
  renderSymbol,
  value = 0,
  onChange,
  onBlur,
  containerStyle,
}: RateInputProps) => {
  const styles = useGetRateInputStyles({ size, disabled });
  const dims = rateInputSizeConfig[size];

  const handlePress = useCallback(
    (index: number) => {
      if (disabled) return;
      const newValue = index + 1;
      onChange?.(newValue === value ? 0 : newValue);
      onBlur?.();
    },
    [disabled, onChange, onBlur, value],
  );

  const getEmoji = (index: number): string => {
    if (typeof emojis === "string") return emojis;
    if (Array.isArray(emojis)) return emojis[index] ?? emojis[emojis.length - 1];
    return "";
  };

  const renderItem = (index: number) => {
    const filled = index < value;

    if (renderSymbol) {
      return renderSymbol(index, filled);
    }

    if (emojis) {
      return (
        <Text
          style={StyleSheet.flatten([
            styles.emoji,
            !filled && { opacity: 0.3 },
          ])}
        >
          {getEmoji(index)}
        </Text>
      );
    }

    return (
      <StarIcon
        size={dims.symbolSize}
        color={filled ? styles.fillColor : styles.baseColor}
        filled={filled}
      />
    );
  };

  return (
    <View
      style={StyleSheet.flatten([styles.container, disabled && { opacity: 0.5 }, containerStyle])}
      testID="YOKTER_RATE_INPUT_CONTAINER"
    >
      {Array.from({ length: maxRating }, (_, i) => (
        <Pressable
          key={i}
          onPress={() => handlePress(i)}
          disabled={disabled}
          style={styles.symbol}
          testID={`YOKTER_RATE_INPUT_SYMBOL_${i}`}
        >
          {renderItem(i)}
        </Pressable>
      ))}
    </View>
  );
};
