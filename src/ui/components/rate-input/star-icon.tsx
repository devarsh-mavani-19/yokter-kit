import Svg, { Path } from "react-native-svg";

type StarIconProps = {
  size: number;
  color: string;
  filled: boolean;
};

export const StarIcon = ({ size, color, filled }: StarIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.29l5.16.756a.53.53 0 0 1 .294.904l-3.733 3.638a.53.53 0 0 0-.152.469l.882 5.14a.53.53 0 0 1-.771.56L12.25 16.41a.53.53 0 0 0-.5 0l-4.615 2.426a.53.53 0 0 1-.77-.56l.881-5.14a.53.53 0 0 0-.152-.47L3.36 8.925a.53.53 0 0 1 .294-.905l5.16-.755a.53.53 0 0 0 .4-.29l2.31-4.68Z"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
