import React from "react";
import type { I18nContextType } from "../types/i18n.type";

export const I18nContext = React.createContext<I18nContextType>({});

export const I18nContextProvider: React.FC<
  React.PropsWithChildren<I18nContextType>
> = ({ children, i18nProvider }) => {
  return (
    <I18nContext.Provider value={{ i18nProvider }}>
      {children}
    </I18nContext.Provider>
  );
};
