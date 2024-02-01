import isoCountries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import cnCountries from 'i18n-iso-countries/langs/zh.json';

isoCountries.registerLocale(enCountries);
isoCountries.registerLocale(cnCountries);

const languageConversionMap = {
  cn: 'zh',
};

export const getCountries = (lang = 'en') => {
  const language = languageConversionMap[lang as keyof typeof languageConversionMap] ?? lang;
  const countries = isoCountries.getNames(language, { select: 'official' });

  return Object.entries(countries).map(([isoCode, title]) => ({
    const: isoCode,
    title,
  }));
};
