export type LocalizeFunction<TKey extends string = string> = (
  key: TKey,
  options?: Record<string, unknown>,
  defaultMessage?: string,
) => string;

export type ChangeLocaleFunction<TLocale extends string = string> = (
  locale: TLocale,
) => void;

export type GetLocaleFunction<TLocale extends string = string> = () => TLocale;

export type I18nProvider<
  TLocale extends string = string,
  TKey extends string = string,
> = {
  localize: LocalizeFunction<TKey>;
  changeLocale: ChangeLocaleFunction<TLocale>;
  getLocale: GetLocaleFunction<TLocale>;
};

export type I18nContextType = {
  i18nProvider?: I18nProvider;
};
