import { useState, useCallback, useMemo } from "react";
import { BaseRecord } from "../../../core/types/data-provider.type";
import { HttpError } from "../../../core/types/data.type";
import { CrudSort } from "../../../core/types/sorter.type";
import { useList, UseListProps } from "../../../core/hooks/use-list";

export type UseTableProps<
  _TData extends BaseRecord = BaseRecord,
  _TError extends HttpError = HttpError,
> = {
  pagination?: {
    current?: number;
    pageSize?: number;
    mode?: "off" | "client" | "server";
  };
  sorters?: CrudSort[];
  enabled?: boolean;
  resetPaginationOnChanged?: unknown;
} & Omit<UseListProps, "pagination" | "sorters">;

export type UseTableReturnType<
  TData extends BaseRecord = BaseRecord,
> = {
  tableProps: {
    data: TData[];
    loading: boolean;
    pagination:
      | false
      | {
          current: number;
          pageSize: number;
          total: number;
          pageCount: number;
          onPageChange: (page: number) => void;
          onPageSizeChange: (pageSize: number) => void;
        };
    sorters: CrudSort[];
    setSorters: (sorters: CrudSort[]) => void;
  };
  tableQuery: ReturnType<typeof useList<TData>>;
  sorters: CrudSort[];
  setSorters: (sorters: CrudSort[]) => void;
  current: number;
  setCurrent: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageCount: number;
};

export function useTable<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
>({
  pagination,
  sorters: sortersFromProp = [],
  resetPaginationOnChanged,
  enabled,
  ...rest
}: UseTableProps<TData, TError>): UseTableReturnType<TData> {
  const [current, setCurrent] = useState(pagination?.current ?? 1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize ?? 10);
  const [sorters, setSorters] = useState<CrudSort[]>(sortersFromProp);
  const [prevResetKey, setPrevResetKey] = useState(resetPaginationOnChanged);

  const isPaginationEnabled = pagination?.mode !== "off";

  // Reset pagination when resetPaginationOnChanged changes (render-time state derivation)
  if (prevResetKey !== resetPaginationOnChanged) {
    setPrevResetKey(resetPaginationOnChanged);
    if (current !== 1) {
      setCurrent(1);
    }
  }

  const tableQuery = useList<TData>({
    pagination: isPaginationEnabled
      ? { current, pageSize, mode: pagination?.mode ?? "server" }
      : undefined,
    sorters,
    enabled,
    ...rest,
  });

  const data = tableQuery.data;
  const [prevTotal, setPrevTotal] = useState(0);
  const rawTotal = data?.total;
  // Keep the previous total while loading to prevent pagination from flashing 1/1
  const total = rawTotal ?? (tableQuery.isFetching ? prevTotal : 0);
  if (rawTotal != null && rawTotal !== prevTotal) {
    setPrevTotal(rawTotal);
  }
  const pageCount = isPaginationEnabled ? Math.ceil(total / pageSize) || 1 : 1;

  // Derive safe current without triggering setState during render
  const safeCurrent = Math.min(current, pageCount);

  const onPageChange = useCallback((page: number) => {
    setCurrent(page);
  }, []);

  const onPageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrent(1);
  }, []);

  const paginationProps = useMemo(() => {
    if (!isPaginationEnabled) return false as const;
    return {
      current: safeCurrent,
      pageSize,
      total,
      pageCount,
      onPageChange,
      onPageSizeChange,
    };
  }, [isPaginationEnabled, safeCurrent, pageSize, total, pageCount, onPageChange, onPageSizeChange]);

  const tableProps = useMemo(
    () => ({
      data: data?.data ?? [],
      loading: tableQuery.isLoading || tableQuery.isFetching,
      pagination: paginationProps,
      sorters,
      setSorters,
    }),
    [data?.data, tableQuery.isLoading, tableQuery.isFetching, paginationProps, sorters],
  );

  return {
    tableProps,
    tableQuery,
    sorters,
    setSorters,
    current: safeCurrent,
    setCurrent,
    pageSize,
    setPageSize,
    pageCount,
  };
}
