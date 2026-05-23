import { ThemeConfig } from "../../types";
import { darkModeColorSemantic } from "./darkModeColorSemantic";
import { font } from "./fonts";
import { lightModeColorSemantic } from "./lightModeColorSemantic";
import { radius } from "./radius";
import { shadow } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const blackAndWhiteThemeConfig: ThemeConfig = {
  font,
  typography,
  darkModeColorSemantic,
  lightModeColorSemantic,
  radius,
  shadow,
  spacing,
};
