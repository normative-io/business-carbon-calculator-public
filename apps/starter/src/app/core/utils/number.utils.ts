const USER_LOCALE = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
const CURRENCY_OPTIONS = Intl.NumberFormat(USER_LOCALE, { currency: 'EUR', style: 'currency' }).resolvedOptions();
export const DECIMAL_SEPARATOR = formatNumber(1.1).replace(/1/g, '');

const DECIMAL_SEPARATORS = new RegExp(`\\${DECIMAL_SEPARATOR}`, 'g');
const NON_NUMBERS = new RegExp(`[^\\d\\${DECIMAL_SEPARATOR}-]`, 'g');

/** Formats a number to a currency string based on the user's default locale. */
export function formatCurrency(
  value?: number | null,
  currency?: string | null,
  options?: Intl.NumberFormatOptions
): string {
  // Do not render fraction digits if a whole number
  const fractionDigits: Intl.NumberFormatOptions =
    typeof value === 'number' && value % 1 === 0 ? { maximumFractionDigits: 0, minimumFractionDigits: 0 } : {};

  const formatOptions: Intl.NumberFormatOptions = currency
    ? { ...CURRENCY_OPTIONS, ...fractionDigits, ...options, currency }
    : { ...CURRENCY_OPTIONS, ...fractionDigits, ...options, style: 'decimal' };

  return formatNumber(value, formatOptions);
}

/** Formats a number based on the user's default locale. */
export function formatNumber(value?: number | null, options?: Intl.NumberFormatOptions): string {
  return typeof value === 'number' ? value.toLocaleString(USER_LOCALE, options) : '';
}

/** Parses a number from a string (ignoring any non-numeric characters except the default decimal seperator). */
export function parseNumber(value: string): number | null {
  const numeric = value.replace(NON_NUMBERS, '').replace(DECIMAL_SEPARATORS, '.');
  const float = parseFloat(numeric);
  return !Number.isNaN(float) ? float : null;
}
