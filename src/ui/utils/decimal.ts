export function getDecimalSeparator(locale?: string): string {
  try {
    const resolvedLocale = locale ?? "en";
    return Intl.NumberFormat(resolvedLocale)
      .format(1.1)
      .replace(/\d/g, "");
  } catch {
    return ".";
  }
}

export function formatNumber(
  value: number,
  decimalScale: number | undefined,
  decimalSeparator: string,
): string {
  const formatted =
    decimalScale !== undefined ? value.toFixed(decimalScale) : String(value);
  return formatted.replace(".", decimalSeparator);
}

export function parseNumber(
  text: string,
  decimalSeparator: string,
): number | null {
  const normalized = text.replace(decimalSeparator, ".");
  const parsed = Number(normalized);
  return isNaN(parsed) ? null : parsed;
}
