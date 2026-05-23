import Svg, { Path } from "react-native-svg";

type ChevronIconProps = {
  size: number;
  color: string;
};

export const ChevronIcon = ({ size, color }: ChevronIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
