import Svg, { Path } from "react-native-svg";

type ArrowIconProps = {
  size: number;
  color: string;
};

export const ArrowIcon = ({ size, color }: ArrowIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
