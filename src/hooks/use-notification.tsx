import { useCallback } from "react";
import { useYokterContext } from "../context/yokter.context";
import {
  INotificationContext,
  OpenNotificationParams,
} from "../types/notification.type";

export const useNotification = (): INotificationContext => {
  const { notificationProvider } = useYokterContext();

  const open = useCallback(
    (params: OpenNotificationParams) => notificationProvider?.open(params),
    [notificationProvider],
  );
  const close = useCallback(
    (key: string) => notificationProvider?.close(key),
    [notificationProvider],
  );

  return { open, close };
};
