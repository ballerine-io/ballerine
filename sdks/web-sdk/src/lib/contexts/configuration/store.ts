import { writable } from 'svelte/store';
import { IAppConfiguration } from './types';
import { configuration as defaultConfiguration } from '../../defaultConfiguration/configuration';

export const configuration = writable<IAppConfiguration>(defaultConfiguration);

Object.defineProperty(window, 'configStore', {
  get: (): any => {
    return configuration.subscribe(e => console.log(e));
  },
});