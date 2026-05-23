import {
  InvalidateQueryFilters,
  UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";
import { useInvalidate } from "./use-invalidate";
import { useNotification } from "../../notification/hooks/use-notification";
import { BaseRecord, SingleResponse } from "../types/data-provider.type";
import { OpenNotificationParams } from "../../notification/types/notification.type";
import { HttpError } from "../types/data.type";
import { getQueryKey } from "../utils/query-key.util";
import { useYokterContext } from "../context/yokter.context";

export type UseDeleteParams = {
  resource?: string;
  id?: string;
  meta?: { [k: string]: unknown };
};

export type UseDeleteProps<
  TData extends BaseRecord = BaseRecord,
  TVariables = object,
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
        error?: HttpError,
        values?: TVariables,
        resource?: string,
      ) => OpenNotificationParams | false | undefined);
  mutationOptions?: Omit<
    UseMutationOptions<SingleResponse<unknown>, HttpError, UseDeleteParams>,
    "mutationFn" | "mutationKey"
  >;
};

export const useDelete = ({
  resource: resourceFromProps,
  id: idFromProps,
  invalidateQueryFilters,
  successNotification,
  errorNotification,
  mutationOptions,
}: UseDeleteProps = {}) => {
  const { invalidateResource } = useInvalidate();
  const { dataProvider } = useYokterContext();
  const { open } = useNotification();

  return useMutation<SingleResponse<unknown>, HttpError, UseDeleteParams>({
    ...mutationOptions,
    mutationKey: resourceFromProps
      ? getQueryKey({
          resource: resourceFromProps,
          id: idFromProps,
          action: "delete",
        })
      : ["delete"],
    mutationFn: ({ resource = resourceFromProps, id = idFromProps, meta }) => {
      if (!resource) {
        throw new Error("[useDelete]: `resource` is not defined");
      }
      if (!id) {
        throw new Error("[useDelete]: `id` is not provided");
      }
      return dataProvider.deleteOne({ resource, id, meta });
    },
    onSuccess: (
      data,
      { resource = resourceFromProps, id = idFromProps },
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
          ? successNotification(data, undefined, resourceFromProps)
          : successNotification;

      if (notificationConfig) {
        open?.(notificationConfig);
      }

      mutationOptions?.onSuccess?.(data, { resource, id }, onMutateResult, context);
    },
    onError: (
      error: HttpError,
      { resource = resourceFromProps, id = idFromProps },
      onMutateResult,
      context,
    ) => {
      const notificationConfig =
        typeof errorNotification === "function"
          ? errorNotification(error, undefined, resourceFromProps)
          : errorNotification;

      if (notificationConfig) {
        open?.(notificationConfig);
      }

      mutationOptions?.onError?.(error, { resource, id }, onMutateResult, context);
    },
  });
};
