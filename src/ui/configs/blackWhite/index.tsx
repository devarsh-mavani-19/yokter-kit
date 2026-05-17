import { ThemeConfig } from "../../types";
import { darkModeColorSemantic } from "./darkModeColorSemantic";
import { font } from "./fonts";
import { lightModeColorSemantic } from "./lightModeColorSemantic";
import { radius } from "./radius";
import { shadow } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

export const blackAndWhiteThemeConfig: ThemeConfig = {
  font,
  zIndex,
  typography,
  darkModeColorSemantic,
  lightModeColorSemantic,
  radius,
  shadow,
  spacing,
};
