import { useQuery } from "@tanstack/react-query";
import {
  BaseRecord,
  GetOneParams,
  SingleResponse,
} from "../types/data-provider.type";
import { HttpError } from "../types/data.type";
import { getQueryKey } from "../utils/query-key.util";
import { useYokterContext } from "../context/yokter.context";

export type UseOneProps = GetOneParams;

export const useOne = <TData extends BaseRecord = BaseRecord>(
  props: UseOneProps,
) => {
  const { dataProvider } = useYokterContext();

  return useQuery<SingleResponse<TData>, HttpError>({
    queryKey: getQueryKey(props),
    queryFn: () => dataProvider.getOne<TData>(props),
    enabled: props.enabled,
  });
};
