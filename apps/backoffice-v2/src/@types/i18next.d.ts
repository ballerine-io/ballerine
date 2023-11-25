import translationI18nNamespace from '../../public/locales/en/translation.json';
import toastI18nNamespace from '../../public/locales/en/toast.json';

interface TranslationOptions {
  defaultNS: 'translation';

  resources: {
    translation: typeof translationI18nNamespace;
    toast: typeof toastI18nNamespace;
  };
}

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomTypeOptions extends TranslationOptions {}
}

declare module 'react-i18next' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomTypeOptions extends TranslationOptions {}
}
