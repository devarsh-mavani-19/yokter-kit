import { View } from "react-native";

type CrossIconProps = {
  size: number;
  color: string;
};

export const CrossIcon = ({ size, color }: CrossIconProps) => {
  const strokeWidth = Math.max(1.5, size * 0.12);
  const lineLength = size * 0.5;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: lineLength,
          height: 0,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          position: "absolute",
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          width: lineLength,
          height: 0,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          position: "absolute",
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
  );
};
