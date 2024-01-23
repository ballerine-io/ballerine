import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // For all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: import.meta.env.VITE_I18N_DEBUG === 'true',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true,
    },
    detection: {
      order: ['querystring'],
      lookupQuerystring: 'lng',
    },
  });

export default i18next;
