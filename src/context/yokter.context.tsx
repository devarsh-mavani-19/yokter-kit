import React, { createContext, useContext } from "react";
import { NotificationProvider } from "../types/notification.type";
import { I18nProvider } from "../types/i18n.type";
import { DataProvider } from "../types/data-provider.type";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../clients/query.client";

export type YokterProviderProps<
  TLocale extends string = string,
  TKey extends string = string,
> = {
  notificationProvider?: NotificationProvider;
  i18nProvider?: I18nProvider<TLocale, TKey>;
  dataProvider: DataProvider;
  children: React.ReactNode;
};

export type YokterContextType<
  TLocale extends string = string,
  TKey extends string = string,
> = {
  notificationProvider?: NotificationProvider;
  i18nProvider?: I18nProvider<TLocale, TKey>;
  dataProvider: DataProvider;
};

const YokterContext = createContext<YokterContextType | undefined>(undefined);

export function YokterProvider<
  TLocale extends string = string,
  TKey extends string = string,
>({
  notificationProvider,
  i18nProvider,
  dataProvider,
  children,
}: YokterProviderProps<TLocale, TKey>) {
  return (
    <QueryClientProvider client={queryClient}>
      <YokterContext.Provider
        value={{
          notificationProvider,
          i18nProvider: i18nProvider as I18nProvider | undefined,
          dataProvider,
        }}
      >
        {children}
      </YokterContext.Provider>
    </QueryClientProvider>
  );
}

export function useYokterContext() {
  const context = useContext(YokterContext);
  if (!context) {
    throw new Error("useYokterContext must be used within a YokterProvider");
  }
  return context;
}
