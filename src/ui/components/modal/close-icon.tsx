import Svg, { Path } from "react-native-svg";

type CloseIconProps = {
  size: number;
  color: string;
};

export const CloseIcon = ({ size, color }: CloseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
