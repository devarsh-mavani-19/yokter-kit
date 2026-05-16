import { useInfiniteQuery } from "@tanstack/react-query";
import { getQueryKey } from "../utils/query-key.util";
import { BaseRecord, GetListParams } from "../types/data-provider.type";
import { useYokterContext } from "../context/yokter.context";

export type UseInfiniteListProps = Omit<GetListParams, "pagination"> & {
  pageSize?: number;
};

export function useInfiniteList<TData extends BaseRecord>({
  pageSize = 10,
  ...props
}: UseInfiniteListProps) {
  const { dataProvider } = useYokterContext();

  return useInfiniteQuery({
    queryKey: [...getQueryKey(props), "infinite"],
    queryFn: ({ pageParam }) =>
      dataProvider.getList<TData>({
        ...props,
        pagination: {
          mode: "server",
          current: pageParam,
          pageSize,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const hasNextPage = lastPage.data.length === pageSize;
      return hasNextPage ? lastPageParam + 1 : undefined;
    },
  });
}
