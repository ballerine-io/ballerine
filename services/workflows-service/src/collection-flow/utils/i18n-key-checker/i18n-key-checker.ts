import { AnyRecord } from '@ballerine/common';
import { createInstance, ResourceLanguage } from 'i18next';

export const i18nKeyChecker = (translations: Record<string, AnyRecord>) => {
  const i18n = createInstance();
  const languages = Object.keys(translations);

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    //Avoiding circular reference
    resources: languages.reduce((acc, language) => {
      acc[language] = { translation: translations[language] as ResourceLanguage };

      return acc;
    }, {} as Record<string, { translation: ResourceLanguage }>),
    initImmediate: true,
  });

  i18n.addResourceBundle('en', 'translation', translations);

  for (const language of languages) {
    i18n.addResourceBundle(language, 'translation', translations);
  }

  const keyCheck = (key: string) => {
    for (const language of languages) {
      const value = i18n.t(key, { lng: language });

      if (key === value) {
        throw new Error(`Translation not found for key: ${key} and language: ${language}`);
      }
    }

    return key;
  };

  return keyCheck;
};
