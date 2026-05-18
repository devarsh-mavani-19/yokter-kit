import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode, useCallback } from "react";
import { RadioSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { Typography } from "../typography";
import { useGetRadioStyles } from "./use-get-radio-styles";

export type RadioProps = Omit<FormInputFieldProps<boolean>, "errorMessage"> & {
  size?: RadioSize;
  disabled?: boolean;
  label?: string | ReactNode;
  containerStyle?: ViewStyle;
};

export const Radio = ({
  size = "md",
  disabled,
  value,
  label,
  onChange,
  onBlur,
  containerStyle,
}: RadioProps) => {
  const { outer, dot, label: labelStyle, gap } = useGetRadioStyles({
    size,
    selected: value,
    disabled,
  });

  const handlePress = useCallback(() => {
    if (!value) {
      onChange?.(true);
    }
  }, [onChange, value]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  return (
    <Pressable
      onPress={handlePress}
      onBlur={handleBlur}
      disabled={disabled}
      style={StyleSheet.flatten([
        {
          flexDirection: "row",
          alignItems: "center",
          gap,
        },
        disabled && { opacity: 0.7 },
        containerStyle,
      ])}
    >
      <View style={outer}>
        {value && <View style={dot} />}
      </View>
      {label != null && (
        typeof label === "string" ? (
          <Typography style={labelStyle}>{label}</Typography>
        ) : (
          label
        )
      )}
    </Pressable>
  );
};

export type RadioGroupProps<T extends string> = {
  value?: T;
  onChange?: (value: T) => void;
  options: { value: T; label: string | ReactNode; disabled?: boolean }[];
  size?: RadioSize;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  direction?: "row" | "column";
  gap?: number;
};

export const RadioGroup = <T extends string>({
  value,
  onChange,
  options,
  size = "md",
  disabled,
  containerStyle,
  itemStyle,
  direction = "column",
  gap: groupGap = 12,
}: RadioGroupProps<T>) => {
  return (
    <View style={StyleSheet.flatten([{ flexDirection: direction, gap: groupGap }, containerStyle])}>
      {options.map((option) => (
        <Radio
          key={option.value}
          size={size}
          disabled={disabled ?? option.disabled}
          value={value === option.value}
          label={option.label}
          onChange={() => onChange?.(option.value)}
          containerStyle={itemStyle}
        />
      ))}
    </View>
  );
};
