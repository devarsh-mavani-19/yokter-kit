import { useCallback, useContext } from "react";
import { I18nContext } from "../context/i18n.context";

/**
 * If you need to know the current locale, yokter provides the `useGetLocale` hook.
 * It returns the getLocale method from `i18nProvider` under the hood.
 */
export const useGetLocale = () => {
  const { i18nProvider } = useContext(I18nContext);

  if (!i18nProvider) {
    throw new Error(
      "useGetLocale cannot be called without i18nProvider being defined.",
    );
  }

  return useCallback(() => i18nProvider.getLocale(), [i18nProvider]);
};
