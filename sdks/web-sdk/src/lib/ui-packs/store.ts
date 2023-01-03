import { writable } from 'svelte/store';
import { uiTheme } from './default/theme';
import { IUIPackTheme } from './types';

export const uiPack = writable<IUIPackTheme>(uiTheme);
