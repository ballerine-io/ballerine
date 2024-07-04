import { createInstance, i18n } from 'i18next';

import { AnyRecord } from '@ballerine/common';
import cn from './locales/cn/translation.json';
import en from './locales/en/translation.json';

const supportedLanguages = [
  { language: 'en', resource: en },
  { language: 'cn', resource: cn },
];

export interface ITranslationServiceResource {
  language: string;
  resource: AnyRecord;
}

export class TranslationService {
  private __i18next: i18n;

  constructor(resources: ITranslationServiceResource[] = supportedLanguages) {
    this.__i18next = createInstance({
      fallbackLng: 'en',
      initImmediate: true,
      nsSeparator: false,
      //@ts-ignore
      resources: resources.reduce((acc, { language, resource }) => {
        acc[language] = { translation: resource };

        return acc;
      }, {} as AnyRecord),
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      void this.__i18next.init(err => {
        if (err) {
          return reject(err);
        }

        resolve(null);
      });
    });
  }

  translate(key: string, lng: string, options: Record<string, unknown> = {}) {
    const result = this.__i18next.t(key, { ...options, lng });

    return result;
  }
}
