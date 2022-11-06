import { writable } from 'svelte/store';
import { Languages } from './types';
import { texts } from '../../utils/configuration-manager';

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
    path = `${language}.${namespacePath}.${key}`;
    text = get(texts, path);
    console.log('fallback to default translation, missing key', lastKey);
  }
  return text || 'Missing translation: ' + path;
};

const get = (obj: any, path: string) => {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const result = path.split('.').reduce((res, key) => res && res[key], obj);
  return result;
};
