import { TextStyle, ViewStyle } from "react-native";
import { useTheme } from "../../hooks";

export type UseGetAccordionStylesProp = Record<string, never>;

export type UseGetAccordionStylesReturn = {
  container: ViewStyle;
  item: ViewStyle;
  header: ViewStyle;
  headerDisabled: ViewStyle;
  title: TextStyle;
  titleDisabled: TextStyle;
  chevronColor: string;
  chevronDisabledColor: string;
  chevronSize: number;
  content: ViewStyle;
  contentText: TextStyle;
};

export const useGetAccordionStyles =
  (): UseGetAccordionStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const container: ViewStyle = {
    borderWidth: 1,
    borderColor: colors.baseBorder,
    borderRadius: 8,
    overflow: "hidden",
  };

  const item: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.baseBorder,
  };

  const header: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.baseBackground,
  };

  const headerDisabled: ViewStyle = {
    opacity: 0.5,
  };

  const title: TextStyle = {
    fontSize: 15,
    fontWeight: "500",
    color: colors.baseForeground,
    flex: 1,
    marginRight: 8,
  };

  const titleDisabled: TextStyle = {
    color: colors.inputPlaceholder,
  };

  const content: ViewStyle = {
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: colors.baseBackground,
  };

  const contentText: TextStyle = {
    fontSize: 14,
    color: colors.baseForeground,
    lineHeight: 20,
  };

  return {
    container,
    item,
    header,
    headerDisabled,
    title,
    titleDisabled,
    chevronColor: colors.baseForeground,
    chevronDisabledColor: colors.inputPlaceholder,
    chevronSize: 18,
    content,
    contentText,
  };
};
