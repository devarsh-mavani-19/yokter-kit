import { View } from "react-native";

type CheckIconProps = {
  size: number;
  color: string;
};

export const CheckIcon = ({ size, color }: CheckIconProps) => {
  const strokeWidth = Math.max(2, size * 0.15);
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.85,
          borderBottomWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: "45deg" }, { translateY: -size * 0.1 }],
        }}
      />
    </View>
  );
};

export const IndeterminateIcon = ({ size, color }: CheckIconProps) => {
  const strokeWidth = Math.max(2, size * 0.15);
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: size * 0.7,
          height: 0,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
    </View>
  );
};
