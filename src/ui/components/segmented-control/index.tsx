import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode, useCallback } from "react";
import { SegmentedControlSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { Typography } from "../typography";
import { useGetSegmentedControlStyles } from "./use-get-segmented-control-styles";

export type SegmentedControlOption<T> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SegmentedControlBaseProps<T> = {
  options: SegmentedControlOption<T>[];
  size?: SegmentedControlSize;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  renderItem?: (option: SegmentedControlOption<T>, isActive: boolean) => ReactNode;
};

export type SegmentedControlSingleProps<T> = SegmentedControlBaseProps<T> &
  Omit<FormInputFieldProps<T>, "errorMessage"> & {
    mode?: "single";
  };

export type SegmentedControlMultiProps<T> = SegmentedControlBaseProps<T> & {
  mode: "multi";
  value?: T[];
  onChange?: (value: T[]) => void;
  onBlur?: () => void;
};

export type SegmentedControlProps<T> =
  | SegmentedControlSingleProps<T>
  | SegmentedControlMultiProps<T>;

function isMultiMode<T>(
  props: SegmentedControlProps<T>,
): props is SegmentedControlMultiProps<T> {
  return props.mode === "multi";
}

export const SegmentedControl = <T,>(props: SegmentedControlProps<T>) => {
  const {
    options,
    size = "md",
    disabled,
    containerStyle,
    renderItem,
    onChange,
    onBlur,
  } = props;

  const styles = useGetSegmentedControlStyles({ size, disabled });

  const selectedSet = new Set(
    isMultiMode(props)
      ? (props.value ?? [])
      : props.value != null
        ? [props.value]
        : [],
  );

  const handlePress = useCallback(
    (option: SegmentedControlOption<T>) => {
      if (disabled ?? option.disabled) return;

      if (isMultiMode(props)) {
        const current = props.value ?? [];
        const exists = current.some((v) => v === option.value);
        const next = exists
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        (onChange as SegmentedControlMultiProps<T>["onChange"])?.(next);
      } else {
        (onChange as SegmentedControlSingleProps<T>["onChange"])?.(option.value);
      }
      onBlur?.();
    },
    [disabled, props, onChange, onBlur],
  );

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {options.map((option) => {
        const isActive = selectedSet.has(option.value);
        const isItemDisabled = disabled ?? option.disabled;

        return (
          <Pressable
            key={String(option.value)}
            onPress={() => handlePress(option)}
            disabled={isItemDisabled}
            style={StyleSheet.flatten([
              styles.item,
              isActive && styles.itemActive,
              isItemDisabled && !disabled && { opacity: 0.4 },
            ])}
          >
            {renderItem ? (
              renderItem(option, isActive)
            ) : (
              <Typography
                style={StyleSheet.flatten([
                  styles.itemText,
                  isActive && styles.itemTextActive,
                ])}
                numberOfLines={1}
              >
                {option.label}
              </Typography>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
