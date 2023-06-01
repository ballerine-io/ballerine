/**
 * @description Returns a string from a passed date in the format of the entity's browser locale if possible, otherwise falls back to fallbackLocale (defaults to en-US).
 *
 * @param date - An instance of Date to format with Intl.DateTimeFormat.
 * @param [fallbackLocale='en-US'] - A string representing a locale to use if the entity's browser locale is not supported.
 *
 * @see  {@link https://www.localeplanet.com/icu/iso639.html|Supported locales}
 */
export const formatDate = (date: Date, fallbackLocale = 'en-US') => {
  // Can change the fallback locale to the operators' locale.
  const locale =
    typeof navigator !== 'undefined' && 'language' in navigator
      ? navigator.language
      : fallbackLocale;
  const formatter = new Intl.DateTimeFormat(locale, {
    // 07 instead of 7
    day: '2-digit',
    // Dec instead of December
    month: 'short',
    // 2020 instead of 20
    year: 'numeric',
  });

  return formatter.format(date);
};
