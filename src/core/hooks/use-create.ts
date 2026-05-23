import {
  InvalidateQueryFilters,
  UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";
import { useInvalidate } from "./use-invalidate";
import { BaseRecord, SingleResponse } from "../types/data-provider.type";
import { HttpError } from "../types/data.type";
import { OpenNotificationParams } from "../../notification/types/notification.type";
import { useNotification } from "../../notification/hooks/use-notification";
import { getQueryKey } from "../utils/query-key.util";
import { useYokterContext } from "../context/yokter.context";

export type UseCreateParams<TVariables = object> = {
  resource?: string;
  variables?: TVariables;
  meta?: { [k: string]: unknown };
};

export type UseCreateProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = TData,
> = {
  resource?: string;
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
      UseCreateParams<TVariables>
    >,
    "mutationFn" | "mutationKey"
  >;
};

export const useCreate = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = TData,
>({
  resource: resourceFromProps,
  invalidateQueryFilters,
  successNotification,
  errorNotification,
  mutationOptions,
}: UseCreateProps<TData, TError, TVariables> = {}) => {
  const { invalidateResource } = useInvalidate();
  const { open } = useNotification();
  const { dataProvider } = useYokterContext();

  return useMutation<
    SingleResponse<TData>,
    TError,
    UseCreateParams<TVariables>
  >({
    ...mutationOptions,
    mutationKey: resourceFromProps
      ? getQueryKey({ resource: resourceFromProps, action: "create" })
      : ["create"],
    mutationFn: ({ resource = resourceFromProps, variables, meta }) => {
      if (!resource) {
        throw new Error("[useCreate]: `resource` is not defined");
      }
      if (!variables) {
        throw new Error("[useCreate]: `variables` is not provided");
      }
      return dataProvider.create<TData, TVariables>({
        resource,
        variables,
        meta,
      });
    },
    onSuccess: (
      data,
      { resource = resourceFromProps, variables },
      onMutateResult,
      context,
    ) => {
      if (resource) {
        invalidateResource({
          resource,
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
        { resource, variables },
        onMutateResult,
        context,
      );
    },
    onError: (
      error,
      { resource = resourceFromProps, variables },
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
        { resource, variables },
        onMutateResult,
        context,
      );
    },
  });
};
