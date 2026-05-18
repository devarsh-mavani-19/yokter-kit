// Context
export { I18nContext, I18nContextProvider } from "./context/i18n.context";

// Hooks
export { useTranslate } from "./hooks/use-translate";
export { useSetLocale } from "./hooks/use-set-locale";
export { useGetLocale } from "./hooks/use-get-locale";
export { useTranslation } from "./hooks/use-translation";

// Types
export type {
  I18nProvider,
  I18nContextType,
  LocalizeFunction,
  ChangeLocaleFunction,
  GetLocaleFunction,
} from "./types/i18n.type";
