import React, { ReactElement, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  MouseEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { TableSize } from "../../types";
import { BaseRecord } from "../../../core/types/data-provider.type";
import { CrudSort } from "../../../core/types/sorter.type";
import { Typography } from "../typography";
import { Checkbox } from "../checkbox";
import { useGetTableStyles } from "./use-get-table-styles";

export type TableColumn<T> = {
  key: string;
  title: string;
  width?: number;
  flex?: number;
  render?: (value: unknown, record: T, index: number) => ReactElement;
  sorter?: boolean;
  align?: "left" | "center" | "right";
};

export type TableRowSelection<T> = {
  selectedRowKeys: React.Key[];
  onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
};

export type TableProps<T extends BaseRecord = BaseRecord> = ViewProps & {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  size?: TableSize;
  sorters?: CrudSort[];
  setSorters?: (sorters: CrudSort[]) => void;
  rowSelection?: TableRowSelection<T>;
  rowKey?: string | ((record: T, index: number) => React.Key);
  emptyText?: string;
  horizontalScroll?: boolean;
};

function getRowKey<T extends BaseRecord>(
  record: T,
  index: number,
  rowKey?: string | ((record: T, index: number) => React.Key),
): React.Key {
  if (typeof rowKey === "function") return rowKey(record, index);
  if (typeof rowKey === "string" && rowKey in record) {
    const val = record[rowKey];
    if (typeof val === "string" || typeof val === "number") return val;
  }
  if (record.id != null) return record.id;
  return index;
}

export const Table = <T extends BaseRecord = BaseRecord>({
  columns,
  data,
  loading = false,
  size = "md",
  sorters = [],
  setSorters,
  rowSelection,
  rowKey,
  emptyText = "No data",
  horizontalScroll = true,
  ...viewProps
}: TableProps<T>) => {
  const styles = useGetTableStyles({ size });

  const handleSort = useCallback(
    (field: string) => {
      if (!setSorters) return;
      const existing = sorters.find((s) => s.field === field);
      if (!existing) {
        setSorters([{ field, order: "asc" }]);
      } else if (existing.order === "asc") {
        setSorters([{ field, order: "desc" }]);
      } else {
        setSorters([]);
      }
    },
    [sorters, setSorters],
  );

  const selectableData = useMemo(() => {
    if (!rowSelection) return [];
    return data.filter((record) => {
      const props = rowSelection.getCheckboxProps?.(record);
      return !props?.disabled;
    });
  }, [data, rowSelection]);

  const allSelectableKeys = useMemo(
    () => selectableData.map((record) => getRowKey(record, data.indexOf(record), rowKey)),
    [selectableData, data, rowKey],
  );

  const isAllSelected =
    rowSelection != null &&
    allSelectableKeys.length > 0 &&
    allSelectableKeys.every((key) => rowSelection.selectedRowKeys.includes(key));

  const isIndeterminate =
    rowSelection != null &&
    !isAllSelected &&
    allSelectableKeys.some((key) => rowSelection.selectedRowKeys.includes(key));

  const handleSelectAll = useCallback(() => {
    if (!rowSelection) return;
    if (isAllSelected) {
      const newKeys = rowSelection.selectedRowKeys.filter(
        (key) => !allSelectableKeys.includes(key),
      );
      const newRows = data.filter((record, i) =>
        newKeys.includes(getRowKey(record, i, rowKey)),
      );
      rowSelection.onChange(newKeys, newRows);
    } else {
      const newKeys = Array.from(
        new Set([...rowSelection.selectedRowKeys, ...allSelectableKeys]),
      );
      const newRows = data.filter((record, i) =>
        newKeys.includes(getRowKey(record, i, rowKey)),
      );
      rowSelection.onChange(newKeys, newRows);
    }
  }, [rowSelection, isAllSelected, allSelectableKeys, data, rowKey]);

  const handleRowSelect = useCallback(
    (record: T, index: number) => {
      if (!rowSelection) return;
      const props = rowSelection.getCheckboxProps?.(record);
      if (props?.disabled) return;

      const key = getRowKey(record, index, rowKey);
      const isSelected = rowSelection.selectedRowKeys.includes(key);
      const newKeys = isSelected
        ? rowSelection.selectedRowKeys.filter((k) => k !== key)
        : [...rowSelection.selectedRowKeys, key];
      const newRows = data.filter((r, i) =>
        newKeys.includes(getRowKey(r, i, rowKey)),
      );
      rowSelection.onChange(newKeys, newRows);
    },
    [rowSelection, data, rowKey],
  );

  const getCellFlex = (col: TableColumn<T>) => {
    if (col.width) return undefined;
    return col.flex ?? 1;
  };

  const getCellAlign = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "center" as const;
      case "right":
        return "flex-end" as const;
      default:
        return "flex-start" as const;
    }
  };

  const tableContent = (
    <View
      {...viewProps}
      testID="YOKTER_TABLE"
      style={StyleSheet.flatten([styles.container, viewProps?.style])}
    >
      {/* Header */}
      <View style={styles.header}>
        {rowSelection && (
          <View
            style={[
              styles.headerCell,
              { width: 50, justifyContent: "center" },
            ]}
          >
            <Checkbox
              size={size}
              value={isAllSelected || isIndeterminate}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              disabled={allSelectableKeys.length === 0}
            />
          </View>
        )}
        {columns.map((col) => {
          const sorter = sorters.find((s) => s.field === col.key);
          return (
            <View
              key={col.key}
              style={[
                styles.headerCell,
                {
                  width: col.width,
                  flex: getCellFlex(col),
                  justifyContent: getCellAlign(col.align),
                },
              ]}
            >
              <Typography style={styles.headerText}>{col.title}</Typography>
              {col.sorter && setSorters && (
                <Pressable onPress={() => handleSort(col.key)}>
                  <Typography style={styles.sortIcon(!!sorter)}>
                    {sorter?.order === "asc"
                      ? "▲"
                      : sorter?.order === "desc"
                        ? "▼"
                        : "⇅"}
                  </Typography>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* Rows */}
      {data.length > 0 ? (
        data.map((record, rowIndex) => {
          const key = getRowKey(record, rowIndex, rowKey);
          const isSelected =
            rowSelection?.selectedRowKeys.includes(key) ?? false;
          const checkboxProps = rowSelection?.getCheckboxProps?.(record);

          return (
            <TableRow key={String(key)} style={styles.row(rowIndex)}>
              {rowSelection && (
                <View
                  style={[
                    styles.cell,
                    { width: 50, justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Checkbox
                    size={size}
                    value={isSelected}
                    onChange={() => handleRowSelect(record, rowIndex)}
                    disabled={checkboxProps?.disabled}
                  />
                </View>
              )}
              {columns.map((col) => {
                const cellValue = record[col.key];
                return (
                  <View
                    key={col.key}
                    style={[
                      styles.cell,
                      {
                        width: col.width,
                        flex: getCellFlex(col),
                        alignItems: getCellAlign(col.align),
                      },
                    ]}
                  >
                    {col.render ? (
                      col.render(cellValue, record, rowIndex)
                    ) : (
                      <Typography style={styles.cellText}>
                        {cellValue == null
                          ? ""
                          : typeof cellValue === "string" || typeof cellValue === "number" || typeof cellValue === "boolean"
                            ? String(cellValue)
                            : ""}
                      </Typography>
                    )}
                  </View>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Typography style={styles.emptyText}>{emptyText}</Typography>
        </View>
      )}

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );

  if (horizontalScroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={data.length > 0}
        contentContainerStyle={{ minWidth: "100%" }}
      >
        {tableContent}
      </ScrollView>
    );
  }

  return tableContent;
};

type TableRowProps = {
  children: React.ReactNode;
  style: ReturnType<ReturnType<typeof useGetTableStyles>["row"]>;
};

const TableRow = ({ children, style }: TableRowProps) => {
  const [hovered, setHovered] = useState(false);

  const handleHoverIn = useCallback((_e: MouseEvent) => {
    setHovered(true);
  }, []);

  const handleHoverOut = useCallback((_e: MouseEvent) => {
    setHovered(false);
  }, []);

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={[style, hovered && { opacity: 0.85 }]}
    >
      {children}
    </Pressable>
  );
};
