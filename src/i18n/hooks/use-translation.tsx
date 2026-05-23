import { useTranslate } from "./use-translate";
import { useSetLocale } from "./use-set-locale";
import { useGetLocale } from "./use-get-locale";

/**
 * Combines `useTranslate`, `useSetLocale` and `useGetLocale` hooks for a better developer experience.
 * It returns `i18nProvider` methods under the hood.
 *
 * @returns `translate` method to translate the texts.
 * @returns `changeLocale` method to change the locale.
 * @returns `getLocale` method to get the current locale.
 */
export const useTranslation = () => {
  const translate = useTranslate();
  const changeLocale = useSetLocale();
  const getLocale = useGetLocale();

  return {
    translate,
    changeLocale,
    getLocale,
  };
};
