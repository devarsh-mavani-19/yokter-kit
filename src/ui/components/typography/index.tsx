import { Text, TextProps, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { TypographyVariant } from "../../types";
import { useGetTypographyStyles } from "./use-get-typography-styles";

export type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  children?: ReactNode;
};

export const Typography = ({
  variant = "body1",
  style,
  children,
  ...textProps
}: TypographyProps) => {
  const { text } = useGetTypographyStyles({ variant });

  return (
    <Text
      {...textProps}
      style={StyleSheet.flatten([text, style])}
    >
      {children}
    </Text>
  );
};
