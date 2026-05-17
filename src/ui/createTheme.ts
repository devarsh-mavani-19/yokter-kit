import type { ThemeConfig } from "./types";
import { DeepPartial } from "./types";
import { blackAndWhiteThemeConfig } from "./configs/blackWhite";

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T> | undefined,
): T {
  if (!override) return base;

  const result: Record<string, unknown> = { ...base };

  for (const key of Object.keys(override)) {
    const overrideValue = (override as Record<string, unknown>)[key];
    if (overrideValue === undefined) continue;

    const baseValue = (base as Record<string, unknown>)[key];
    if (
      baseValue !== null &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      overrideValue !== null &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as DeepPartial<Record<string, unknown>>,
      );
    } else {
      result[key] = overrideValue;
    }
  }

  return result as T;
}

export function createTheme(overrides?: DeepPartial<ThemeConfig>): ThemeConfig {
  if (!overrides) return blackAndWhiteThemeConfig;
  return deepMerge(blackAndWhiteThemeConfig, overrides);
}

export const defaultTheme = createTheme();
