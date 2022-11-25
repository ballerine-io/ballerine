import { Languages, TranslationType } from '../../contexts/translation';
import { texts } from '../../utils/configuration-manager';

export const getListLength = <
  TLanguage extends Languages,
  TNamespace extends keyof TranslationType[TLanguage],
>(
  language: TLanguage,
  namespace: TNamespace,
) => {
  const list = texts[language][namespace];

  return Object.keys(list as Record<PropertyKey, any>).length - 1;
};
