import {
  ActivityIndicator,
  GestureResponderEvent,
  MouseEvent,
  Pressable,
  PressableProps,
  StyleSheet,
} from "react-native";
import { ButtonSize, ButtonState } from "../../types";
import { ButtonVariant, Typography } from "../..";
import { ReactNode, useCallback, useState } from "react";
import { useGetButtonStyles } from "./use-get-button-theme";

export type ButtonProps = PressableProps & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  danger?: boolean;
};

export const Button = ({
  children,
  variant = "solid",
  size = "md",
  loading,
  disabled,
  danger,
  onPress,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  ...pressableProps
}: ButtonProps) => {
  const [buttonState, setButtonState] = useState<ButtonState>("default");
  const isDisabled = loading ?? disabled ?? false;
  const { container, text } = useGetButtonStyles({
    size,
    disabled: isDisabled,
    loading,
    buttonState,
    variant,
    danger,
  });

  const handleHoverIn = useCallback(
    (event: MouseEvent) => {
      if (!isDisabled) setButtonState("hover");
      onHoverIn?.(event);
    },
    [isDisabled, onHoverIn],
  );

  const handleHoverOut = useCallback(
    (event: MouseEvent) => {
      if (!isDisabled) setButtonState("default");
      onHoverOut?.(event);
    },
    [isDisabled, onHoverOut],
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      onPressIn?.(event);
      if (!isDisabled) setButtonState("press");
    },
    [isDisabled, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      onPressOut?.(event);
      if (!isDisabled) setButtonState("default");
    },
    [isDisabled, onPressOut],
  );

  const handleOnPress = useCallback(
    (event: GestureResponderEvent) => {
      onPress?.(event);
    },
    [onPress],
  );

  return (
    <Pressable
      {...pressableProps}
      testID="YOKTER_BUTTON_PRESSABLE"
      disabled={isDisabled}
      style={StyleSheet.flatten([
        container,
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        pressableProps?.style,
      ])}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleOnPress}
    >
      {/* TODO: replace with own spinner */}
      {loading && <ActivityIndicator color={text.color} />}
      {typeof children === "string" ? (
        <Typography style={text} variant="button">
          {children}
        </Typography>
      ) : (
        children
      )}
    </Pressable>
  );
};
