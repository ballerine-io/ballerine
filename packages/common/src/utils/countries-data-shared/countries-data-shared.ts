import { countryCodes } from '../../countries';
import { State } from 'country-state-city';
import isoCountries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import cnCountries from 'i18n-iso-countries/langs/zh.json';
import nationalities from 'i18n-nationality';
import enNationalities from 'i18n-nationality/langs/en.json';
import type { TFunction } from 'i18next';

isoCountries.registerLocale(enCountries);
isoCountries.registerLocale(cnCountries);
nationalities.registerLocale(enNationalities);

// Language conversion map for supporting different language codes
export const languageConversionMap = {
  cn: 'zh',
};

// Map of nationalities that need special handling
export const unsupportedNationalities = {
  cn: true,
};

// Export shared dependencies
export { isoCountries, nationalities, State, countryCodes };
export type { TFunction };
