import dayjs from 'dayjs';

/**
 * @description Returns a string from a passed date in the format of the entity's browser locale if possible,
 * otherwise falls back to fallbackLocale (defaults to en-US).
 *
 * @param date - An instance of Date to format with dayjs.format.
 * @param [fallbackLocale='en-US'] - A string representing a locale to use if the entity's browser locale is not supported.
 *
 * @see  {@link https://www.localeplanet.com/icu/iso639.html|Supported locales}
 * @returns Formatted date string
 */
export const formatDate = (date: Date, fallbackLocale = 'en-US') => {
  // Can change the fallback locale to the operators' locale.
  const locale =
    typeof navigator !== 'undefined' && 'language' in navigator
      ? navigator.language
      : fallbackLocale;

  // Format: '07' instead of '7', 'Dec' instead of 'December', '2020' instead of '20'
  return dayjs(date).locale(locale).format('DD MMM YYYY');
};
