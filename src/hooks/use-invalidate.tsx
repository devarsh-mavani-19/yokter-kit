import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "../utils/query-key.util";

export type UseInvalidateProps = {
  resource: string;
  id?: string;
  invalidateQueryFilters?: InvalidateQueryFilters;
};

export const useInvalidate = () => {
  const queryClient = useQueryClient();

  const invalidateResource = async ({
    resource,
    id,
    invalidateQueryFilters,
  }: UseInvalidateProps) => {
    // invalidate all queries for this resource (including filtered lists, infinite lists, and individual records)
    await queryClient.invalidateQueries({
      ...invalidateQueryFilters,
      queryKey: invalidateQueryFilters?.queryKey ?? [resource.split("/")[0]],
      type: invalidateQueryFilters?.type ?? "all",
      refetchType: invalidateQueryFilters?.refetchType ?? "all",
      predicate:
        invalidateQueryFilters?.predicate ??
        ((query) => {
          const queryKey = query.queryKey;
          const resourceParts = resource.split("/").filter(Boolean);
          // check if the query key starts with any part of the resource
          return resourceParts.some((part, index) => queryKey[index] === part);
        }),
    });

    // also invalidate the specific record query if we have an ID
    if (id) {
      await queryClient.invalidateQueries({
        queryKey: getQueryKey({ resource, id }),
      });
    }
  };

  const invalidateAll = async () => {
    await queryClient.invalidateQueries();
  };

  return { invalidateResource, invalidateAll };
};
