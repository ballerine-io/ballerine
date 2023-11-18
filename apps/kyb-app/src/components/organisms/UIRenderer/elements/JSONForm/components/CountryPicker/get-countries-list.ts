import { isoCountriesRecord } from './iso-countries-record';

export const getCountriesList = () =>
  Object.entries(isoCountriesRecord).map(([isoCode, fullName]) => ({
    const: isoCode,
    title: Array.isArray(fullName) ? fullName[0] : fullName,
  }));
