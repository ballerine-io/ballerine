import { Languages } from '../../contexts/translation';
import { texts } from '../../utils/configuration-manager';

export const getListLength = (language: Languages, namespace: string) => {
  const list = texts[language][namespace];

  return Object.keys(list).length - 1;
};
