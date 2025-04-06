import { getCountries } from '../get-countries';

export const checkIsCountry = (locale: string, value: string) => {
  return getCountries(locale).some(country => country.const === value);
};
