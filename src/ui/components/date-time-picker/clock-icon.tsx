import Svg, { Circle, Path } from "react-native-svg";

type ClockIconProps = {
  size: number;
  color: string;
};

export const ClockIcon = ({ size, color }: ClockIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.5} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
