import React, { createContext, useContext } from "react";
import { NotificationProvider } from "../../notification/types/notification.type";
import { I18nProvider } from "../../i18n/types/i18n.type";
import { I18nContextProvider } from "../../i18n/context/i18n.context";
import { DataProvider } from "../types/data-provider.type";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../clients/query.client";
import { ThemeProvider } from "../../ui";

export type YokterProviderProps<
  TLocale extends string = string,
  TKey extends string = string,
> = {
  notificationProvider?: NotificationProvider;
  i18nProvider?: I18nProvider<TLocale, TKey>;
  dataProvider: DataProvider;
  children: React.ReactNode;
};

export type YokterContextType = {
  notificationProvider?: NotificationProvider;
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
          dataProvider,
        }}
      >
        <I18nContextProvider
          i18nProvider={i18nProvider as I18nProvider | undefined}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </I18nContextProvider>
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
