import { writable } from 'svelte/store';
import { IAppConfigurationUI } from '../contexts/configuration';
import { uiTheme } from './default/theme'

export const uiPack = writable<IAppConfigurationUI>(uiTheme);

