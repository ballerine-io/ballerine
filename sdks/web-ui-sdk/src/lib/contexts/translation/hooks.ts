import { writable } from 'svelte/store';
import { Languages } from './types';
import { texts } from '../../services/configuration-manager';

export const currentLanguage = writable<Languages>('en');

let language: string;

currentLanguage.subscribe(lang => {
  language = lang;
});

export const t = (namespace: string, key: string) => {
  let path = `${language}.${namespace}.${key}`;

  let text = get(texts, path);
  if (!text) {
    const namespacePath = namespace.split('.');
    const lastKey = namespacePath.pop();
    path = `${language}.${namespacePath.join('.')}.${key}`;
    text = get(texts, path);
    console.log('fallback to default translation, missing key', lastKey);
  }
  return text || 'Missing translation: ' + path;
};

const get = (obj: Record<string, unknown>, path: string): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result = path.split('.').reduce((res, key) => res && res[key], obj);
  return result;
};
