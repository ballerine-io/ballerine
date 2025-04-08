import { isoCountries } from '../countries-data-shared';

export const getFullCountryNameByCode = (countryCode: string) => {
  return isoCountries.getName(countryCode?.toLocaleUpperCase(), 'en');
};
