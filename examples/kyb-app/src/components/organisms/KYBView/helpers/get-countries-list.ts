import isoCountries from 'i18n-iso-countries';
import locale from 'i18n-iso-countries/langs/en.json';

isoCountries.registerLocale(locale);
const isoCountriesRecord = isoCountries.getNames('en', { select: 'official' });

export interface ICountry {
  fullName: string;
  isoCode: string;
}

export const getCountriesList = (): ICountry[] =>
  Object.entries(isoCountriesRecord).map(([isoCode, fullName]) => ({ isoCode, fullName }));
