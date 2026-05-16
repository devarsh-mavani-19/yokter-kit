import { useMemo } from "react";
import { useYokterContext } from "../context/yokter.context";

/**
 * If you need to translate the texts in your own components, yokter provides the `useLocalize` hook.
 * It returns the translate method from `i18nProvider` under the hood.
 */
export const useLocalize = () => {
  const { i18nProvider } = useYokterContext();

  const fn = useMemo(() => {
    function localize(
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

    return localize;
  }, [i18nProvider]);

  return fn;
};
