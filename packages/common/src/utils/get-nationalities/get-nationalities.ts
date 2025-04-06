import { nationalities, unsupportedNationalities, type TFunction } from '../countries-data-shared';

export const getNationalities = (language = 'en', t: TFunction) => {
  const isUnsupportedLanguage =
    unsupportedNationalities[language as keyof typeof unsupportedNationalities];

  const nationalitiesByLanguage = nationalities.getNames('en');

  return Object.entries(nationalitiesByLanguage).map(([isoCode, title]) => ({
    const: isoCode,
    title: isUnsupportedLanguage ? t(`countries.${isoCode}.nationality`) : title,
  }));
};
