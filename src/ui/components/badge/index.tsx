import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BadgeSize, BadgeVariant } from "../../types";
import { Typography } from "../typography";
import { useGetBadgeStyles } from "./use-get-badge-styles";

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  containerStyle?: ViewStyle;
};

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  containerStyle,
}: BadgeProps) => {
  const styles = useGetBadgeStyles({ size, variant });

  return (
    <View
      style={StyleSheet.flatten([styles.container, containerStyle])}
      testID="YOKTER_BADGE_CONTAINER"
    >
      {typeof children === "string" ? (
        <Typography style={styles.text}>{children}</Typography>
      ) : (
        children
      )}
    </View>
  );
};
