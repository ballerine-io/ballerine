import { writable } from 'svelte/store';
import { uiTheme } from './default/theme';
import { type IUIPackTheme } from './types';

export const uiPack = writable<IUIPackTheme>(uiTheme);
