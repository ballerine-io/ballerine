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

  const keyCheck = (key: string) => {
    for (const language of languages) {
      if (!i18n.exists(key, { lng: language })) {
        throw new Error(`Translation not found for key: ${key} and language: ${language}`);
      }
    }

    return key;
  };

  return keyCheck;
};
