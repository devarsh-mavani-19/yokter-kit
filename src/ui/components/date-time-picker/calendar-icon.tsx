import Svg, { Path, Rect } from "react-native-svg";

type CalendarIconProps = {
  size: number;
  color: string;
};

export const CalendarIcon = ({ size, color }: CalendarIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={18} rx={2} stroke={color} strokeWidth={1.5} />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
