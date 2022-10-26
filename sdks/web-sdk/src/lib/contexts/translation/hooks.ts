import { writable } from 'svelte/store';
import { Languages } from './types';
import { texts } from '../../utils/configurationManagement';

export const currentLanguage = writable<Languages>('en');

let language: string;

currentLanguage.subscribe(lang => {
  language = lang;
});

export const t = (module: string, key: string) => {
  if (!texts[language]) return 'Language not defined: ' + language;
  if (!texts[language][module]) return 'Text module not found: ' + module;
  if (!texts[language][module][key]) return 'Text key not found: ' + key;
  return texts[language][module][key];
};
