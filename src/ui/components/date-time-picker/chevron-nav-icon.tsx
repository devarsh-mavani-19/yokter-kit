import Svg, { Path } from "react-native-svg";

type ChevronNavIconProps = {
  size: number;
  color: string;
  direction: "left" | "right" | "up" | "down";
};

const rotations: Record<ChevronNavIconProps["direction"], string> = {
  left: "0deg",
  right: "180deg",
  down: "270deg",
  up: "90deg",
};

export const ChevronNavIcon = ({ size, color, direction }: ChevronNavIconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: [{ rotate: rotations[direction] }] }}
  >
    <Path
      d="M15 18l-6-6 6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
