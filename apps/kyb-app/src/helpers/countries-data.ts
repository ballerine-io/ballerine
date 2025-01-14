import { countryCodes } from '@ballerine/common';
import { State } from 'country-state-city';
import isoCountries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import cnCountries from 'i18n-iso-countries/langs/zh.json';
import nationalities from 'i18n-nationality';
import enNationalities from 'i18n-nationality/langs/en.json';
import { TFunction } from 'i18next';

isoCountries.registerLocale(enCountries);
isoCountries.registerLocale(cnCountries);

nationalities.registerLocale(enNationalities);

const languageConversionMap = {
  cn: 'zh',
};

const unsupportedNationalities = {
  cn: true,
};

export const getCountries = (lang = 'en') => {
  const language = languageConversionMap[lang as keyof typeof languageConversionMap] ?? lang;

  return countryCodes.map(isoCode => ({
    const: isoCode,
    title: isoCountries.getName(isoCode?.toLocaleUpperCase(), language),
  }));
};

export const getNationalities = (language = 'en', t: TFunction) => {
  const isUnsupportedLanguage =
    unsupportedNationalities[language as keyof typeof unsupportedNationalities];

  const nationalitiesByLanguage = nationalities.getNames('en');

  return Object.entries(nationalitiesByLanguage).map(([isoCode, title]) => ({
    const: isoCode,
    title: isUnsupportedLanguage ? t(`countries.${isoCode}.nationality`) : title,
  }));
};

export const getCountryStates = (countryCode: string) => {
  if (!countryCode) return [];

  return State.getStatesOfCountry(countryCode.toUpperCase());
};

export const getFullCountryNameByCode = (countryCode: string) => {
  return isoCountries.getName(countryCode?.toLocaleUpperCase(), 'en');
};
