import { writable } from 'svelte/store';
import { IAppConfiguration } from './types';
import { configuration as defaultConfiguration } from '../../configuration/configuration';

export const configuration = writable<IAppConfiguration>(defaultConfiguration);

Object.defineProperty(window, 'configStore', {
  get: () => {
    return configuration.subscribe(e => console.log(e));
  },
});
