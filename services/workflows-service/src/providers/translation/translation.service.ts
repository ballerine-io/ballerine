import { Injectable } from '@nestjs/common';
import i18next from 'i18next';

import en from './locales/en/translation.json';
import cn from './locales/cn/translation.json';

const supportedLanguages = [
  { language: 'en', resource: en },
  { language: 'cn', resource: cn },
];

@Injectable()
export class TranslationService {
  private __i18next = i18next;

  constructor() {
    void this.__i18next.init({
      fallbackLng: 'en',
      initImmediate: false,
      nsSeparator: false,
      resources: {},
    });

    supportedLanguages.forEach(({ language, resource }) => {
      this.__i18next.addResourceBundle(language, 'translation', resource);
    });
  }

  translate(key: string, lng: string, options: Record<string, unknown> = {}) {
    return this.__i18next.t(key, { ...options, lng });
  }
}
