import { Animated, Easing, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { SwitchSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { Typography } from "../typography";
import { useGetSwitchStyles } from "./use-get-switch-styles";

export type SwitchProps = Omit<FormInputFieldProps<boolean>, "errorMessage"> & {
  size?: SwitchSize;
  disabled?: boolean;
  label?: string | ReactNode;
  containerStyle?: ViewStyle;
};

export const Switch = ({
  size = "md",
  disabled,
  value,
  label,
  onChange,
  onBlur,
  containerStyle,
}: SwitchProps) => {
  const { track, thumb, label: labelStyle, gap, thumbTranslate } =
    useGetSwitchStyles({
      size,
      active: value,
      disabled,
    });

  const animatedValue = useMemo(
    () => new Animated.Value(value ? thumbTranslate : 0),
    // Only create once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? thumbTranslate : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [value, thumbTranslate, animatedValue]);

  const handlePress = useCallback(() => {
    onChange?.(!value);
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
      <View style={track}>
        <Animated.View
          style={[thumb, { transform: [{ translateX: animatedValue }] }]}
        />
      </View>
      {label != null &&
        (typeof label === "string" ? (
          <Typography style={labelStyle}>{label}</Typography>
        ) : (
          label
        ))}
    </Pressable>
  );
};
