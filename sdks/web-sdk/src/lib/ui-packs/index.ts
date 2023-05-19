export { uiPack } from './store';
export { UIPackType } from './types';
export type { TUIPacks, IUIPackTheme } from './types';
export { getStepConfiguration, getComponentStyles, getLayoutStyles } from './utils';
import { stepsTheme, uiTheme as future } from './future/theme';
import { uiTheme as blue } from './default/theme';
import type { IUIPackTheme, TUIPacks } from './types';

export const packs: TUIPacks = {
  future: {
    ...(future as Required<IUIPackTheme>),
    steps: stepsTheme,
  },
  default: blue,
};
