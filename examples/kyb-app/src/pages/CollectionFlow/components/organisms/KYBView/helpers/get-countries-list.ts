import isoCountries from 'i18n-iso-countries';
import locale from 'i18n-iso-countries/langs/en.json';
import { State } from 'country-state-city';

isoCountries.registerLocale(locale);
const isoCountriesRecord = isoCountries.getNames('en', { select: 'official' });

export interface ICountry {
  fullName: string;
  isoCode: string;
}

export const getCountriesList = (): ICountry[] =>
  Object.entries(isoCountriesRecord).map(([isoCode, fullName]) => ({ isoCode, fullName }));

export const getCountryStates = (countryCode: string) => {
  if (!countryCode) return [];

  return State.getStatesOfCountry(countryCode.toUpperCase());
};

export const getFullCountryNameByCode = (countryCode: string): string => {
  return isoCountries.getName(countryCode?.toLocaleUpperCase(), 'en');
};
