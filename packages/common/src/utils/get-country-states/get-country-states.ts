import { State } from '../countries-data-shared';

export const getCountryStates = (countryCode: string) => {
  if (!countryCode) {
    return [];
  }

  return State.getStatesOfCountry(countryCode.toUpperCase());
};
