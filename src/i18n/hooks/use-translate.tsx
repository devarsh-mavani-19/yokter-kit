import { useContext, useMemo } from "react";
import { I18nContext } from "../context/i18n.context";

/**
 * If you need to translate the texts in your own components, yokter provides the `useTranslate` hook.
 * It returns the translate method from `i18nProvider` under the hood.
 */
export const useTranslate = () => {
  const { i18nProvider } = useContext(I18nContext);

  const fn = useMemo(() => {
    function translate(
      key: string,
      options?: Record<string, unknown>,
      defaultMessage?: string,
    ) {
      return (
        i18nProvider?.localize(key, options, defaultMessage) ??
        defaultMessage ??
        key
      );
    }

    return translate;
  }, [i18nProvider]);

  return fn;
};
