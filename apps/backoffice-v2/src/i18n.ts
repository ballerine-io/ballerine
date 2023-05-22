import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextHttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import 'react-i18next';

void i18next
  .use(i18nextHttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    ns: ['translation', 'toast'],

    fallbackLng: 'en',

    detection: {
      order: ['path'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      // React already sanitizes HTML, so another sanitization is not necessary
      // Reference: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
      escapeValue: false,
    },
  });
