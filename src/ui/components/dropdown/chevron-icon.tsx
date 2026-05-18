import { View } from "react-native";

type ChevronIconProps = {
  size: number;
  color: string;
  direction?: "up" | "down";
};

export const ChevronIcon = ({ size, color, direction = "down" }: ChevronIconProps) => {
  const strokeWidth = Math.max(1.5, size * 0.12);
  const chevronSize = size * 0.45;
  const isDown = direction === "down";

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: chevronSize,
          height: chevronSize,
          borderBottomWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [
            { rotate: isDown ? "45deg" : "225deg" },
          ],
          marginTop: isDown ? -chevronSize * 0.35 : chevronSize * 0.35,
        }}
      />
    </View>
  );
};
