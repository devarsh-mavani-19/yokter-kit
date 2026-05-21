import { TextStyle, ViewStyle } from "react-native";
import { TableSize } from "../../types";
import { useTheme } from "../../hooks";
import { tableSizeConfig } from "../../constants";

export type UseGetTableStylesProp = {
  size?: TableSize;
};

export type UseGetTableStylesReturn = {
  container: ViewStyle;
  header: ViewStyle;
  headerCell: ViewStyle;
  headerText: TextStyle;
  row: (index: number) => ViewStyle;
  cell: ViewStyle;
  cellText: TextStyle;
  sortIcon: (active: boolean) => TextStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
  loadingOverlay: ViewStyle;
  border: ViewStyle;
};

export const useGetTableStyles = ({
  size = "md",
}: UseGetTableStylesProp): UseGetTableStylesReturn => {
  const { colorMode, themeConfig } = useTheme();

  const colors =
    colorMode === "light"
      ? themeConfig.lightModeColorSemantic
      : themeConfig.darkModeColorSemantic;

  const dimensions = tableSizeConfig[size];

  const container: ViewStyle = {
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
    borderColor: colors.tableBorder,
    overflow: "hidden",
  };

  const header: ViewStyle = {
    flexDirection: "row",
    backgroundColor: colors.tableHeaderBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.tableBorder,
  };

  const headerCell: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: dimensions.cellPaddingHorizontal,
    paddingVertical: dimensions.cellPaddingVertical,
  };

  const headerText: TextStyle = {
    fontSize: dimensions.headerFontSize,
    color: colors.tableHeaderForeground,
  };

  const row = (index: number): ViewStyle => ({
    flexDirection: "row",
    backgroundColor:
      index % 2 === 0
        ? colors.tableRowBackground
        : colors.tableRowBackgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.tableBorder,
  });

  const cell: ViewStyle = {
    paddingHorizontal: dimensions.cellPaddingHorizontal,
    paddingVertical: dimensions.cellPaddingVertical,
    justifyContent: "center",
  };

  const cellText: TextStyle = {
    fontSize: dimensions.cellFontSize,
    color: colors.tableRowForeground,
  };

  const sortIcon = (active: boolean): TextStyle => ({
    fontSize: dimensions.headerFontSize,
    color: active ? colors.tableSortIconActive : colors.tableSortIcon,
    marginLeft: 4,
  });

  const emptyContainer: ViewStyle = {
    paddingVertical: 32,
    paddingHorizontal: dimensions.cellPaddingHorizontal,
    alignItems: "center",
    justifyContent: "center",
  };

  const emptyText: TextStyle = {
    fontSize: dimensions.cellFontSize,
    color: colors.tableEmptyForeground,
  };

  const loadingOverlay: ViewStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  };

  const border: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.tableBorder,
  };

  return {
    container,
    header,
    headerCell,
    headerText,
    row,
    cell,
    cellText,
    sortIcon,
    emptyContainer,
    emptyText,
    loadingOverlay,
    border,
  };
};
