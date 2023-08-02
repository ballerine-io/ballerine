import isoCountries from 'i18n-iso-countries';

const LOCALE_LANG = 'en';

const isoCountriesRecord = isoCountries.getNames(LOCALE_LANG, { select: 'official' });

export interface ICountry {
  fullName: string;
  isoCode: string;
}

export const getCountriesList = (): ICountry[] =>
  Object.entries(isoCountriesRecord).map(([isoCode, fullName]) => ({ isoCode, fullName }));
