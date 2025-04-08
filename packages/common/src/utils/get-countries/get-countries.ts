import { countryCodes } from '../../countries';
import { isoCountries, languageConversionMap } from '../countries-data-shared';

export const getCountries = (lang = 'en') => {
  const language = languageConversionMap[lang as keyof typeof languageConversionMap] ?? lang;

  return countryCodes.map(isoCode => ({
    const: isoCode,
    title: isoCountries.getName(isoCode?.toLocaleUpperCase(), language),
  }));
};
