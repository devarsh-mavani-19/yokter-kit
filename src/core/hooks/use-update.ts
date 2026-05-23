import {
  InvalidateQueryFilters,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useInvalidate } from "./use-invalidate";
import { useNotification } from "../../notification/hooks/use-notification";
import { BaseRecord, SingleResponse } from "../types/data-provider.type";
import { HttpError } from "../types/data.type";
import { OpenNotificationParams } from "../../notification/types/notification.type";
import { getQueryKey } from "../utils/query-key.util";
import { useYokterContext } from "../context/yokter.context";

export type UseUpdateParams<TVariables = object> = {
  resource?: string;
  id?: string;
  variables?: TVariables;
  meta?: { [k: string]: unknown };
};

export type UseUpdateProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = TData,
> = {
  resource?: string;
  id?: string;
  invalidateQueryFilters?: InvalidateQueryFilters;
  successNotification?:
    | OpenNotificationParams
    | false
    | ((
        data?: TData,
        values?: TVariables,
        resource?: string,
      ) => OpenNotificationParams | false | undefined);
  errorNotification?:
    | OpenNotificationParams
    | false
    | ((
        error?: TError,
        values?: TVariables,
        resource?: string,
      ) => OpenNotificationParams | false | undefined);
  mutationOptions?: Omit<
    UseMutationOptions<
      SingleResponse<TData>,
      TError,
      UseUpdateParams<TVariables>
    >,
    "mutationFn" | "mutationKey"
  >;
};

export const useUpdate = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = TData,
>({
  resource: resourceFromProps,
  id: idFromProps,
  invalidateQueryFilters,
  successNotification,
  errorNotification,
  mutationOptions,
}: UseUpdateProps<TData, TError, TVariables> = {}) => {
  const { invalidateResource } = useInvalidate();
  const { dataProvider } = useYokterContext();
  const { open } = useNotification();

  return useMutation<
    SingleResponse<TData>,
    TError,
    UseUpdateParams<TVariables>
  >({
    ...mutationOptions,
    mutationKey: resourceFromProps
      ? getQueryKey({
          resource: resourceFromProps,
          id: idFromProps,
          action: "update",
        })
      : ["update"],
    mutationFn: ({
      resource = resourceFromProps,
      id = idFromProps,
      variables,
      meta,
    }) => {
      if (!resource) {
        throw new Error("[useUpdate]: `resource` is not defined");
      }
      if (!id) {
        throw new Error("[useUpdate]: `id` is not provided");
      }
      return dataProvider.update<TData, TVariables>({
        resource,
        id,
        variables,
        meta,
      });
    },
    onSuccess: (
      data,
      { resource = resourceFromProps, id = idFromProps, variables },
      onMutateResult,
      context,
    ) => {
      if (resource) {
        invalidateResource({
          resource,
          id,
          invalidateQueryFilters,
        });
      }

      const notificationConfig =
        typeof successNotification === "function"
          ? successNotification(data.data, variables, resourceFromProps)
          : successNotification;

      if (notificationConfig) {
        open?.(notificationConfig);
      }

      mutationOptions?.onSuccess?.(
        data,
        { resource, id, variables },
        onMutateResult,
        context,
      );
    },
    onError: (
      error,
      { resource = resourceFromProps, id = idFromProps, variables },
      onMutateResult,
      context,
    ) => {
      const notificationConfig =
        typeof errorNotification === "function"
          ? errorNotification(error, variables, resourceFromProps)
          : errorNotification;

      if (notificationConfig) {
        open?.(notificationConfig);
      }

      mutationOptions?.onError?.(
        error,
        { resource, id, variables },
        onMutateResult,
        context,
      );
    },
  });
};
