import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode, useCallback } from "react";
import { CheckboxSize, CheckboxState } from "../../types";
import { FormInputFieldProps } from "../../types";
import { Typography } from "../typography";
import { useGetCheckboxStyles } from "./use-get-checkbox-styles";
import { CheckIcon, IndeterminateIcon } from "./check-icon";

export type CheckboxProps = Omit<FormInputFieldProps<boolean>, "errorMessage"> & {
  size?: CheckboxSize;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string | ReactNode;
  containerStyle?: ViewStyle;
  boxStyle?: ViewStyle;
};

export const Checkbox = ({
  size = "md",
  disabled,
  indeterminate,
  value,
  label,
  onChange,
  onBlur,
  containerStyle,
  boxStyle,
}: CheckboxProps) => {
  const state: CheckboxState = indeterminate
    ? "indeterminate"
    : value
      ? "checked"
      : "unchecked";

  const { box, icon, label: labelStyle, gap } = useGetCheckboxStyles({
    size,
    state,
    disabled,
  });

  const handlePress = useCallback(() => {
    onChange?.(!value);
  }, [onChange, value]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  return (
    <View
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
      <Pressable
        onPress={handlePress}
        onBlur={handleBlur}
        disabled={disabled}
        style={StyleSheet.flatten([box, boxStyle])}
      >
        {state === "checked" && (
          <CheckIcon size={icon.size} color={icon.color} />
        )}
        {state === "indeterminate" && (
          <IndeterminateIcon size={icon.size} color={icon.color} />
        )}
      </Pressable>
      {label != null && (
        typeof label === "string" ? (
          <Typography style={labelStyle}>{label}</Typography>
        ) : (
          label
        )
      )}
    </View>
  );
};
