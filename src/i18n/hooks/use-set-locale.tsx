import { useCallback, useContext } from "react";
import { I18nContext } from "../context/i18n.context";

/**
 * If you need to change the locale at runtime, yokter provides the `useSetLocale` hook.
 * It returns the changeLocale method from `i18nProvider` under the hood.
 */
export const useSetLocale = () => {
  const { i18nProvider } = useContext(I18nContext);

  return useCallback(
    (locale: string) => i18nProvider?.changeLocale(locale),
    [i18nProvider],
  );
};
