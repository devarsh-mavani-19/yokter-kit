import { useQuery } from "@tanstack/react-query";
import { getQueryKey } from "../utils/query-key.util";
import { BaseRecord, GetListParams } from "../types/data-provider.type";
import { useYokterContext } from "../context/yokter.context";
import { CrudSort } from "../types/sorter.type";

export type UseListProps = Omit<GetListParams, "filters" | "sorters"> & {
  sorters?: CrudSort[];
  enabled?: boolean;
};

export function useList<TData extends BaseRecord>(props: UseListProps) {
  const { dataProvider } = useYokterContext();

  return useQuery({
    queryKey: getQueryKey(props),
    queryFn: () => dataProvider.getList<TData>(props),
    enabled: props.enabled,
  });
}
