import xstateViz from './xstate-viz';
import nightowl from './nightowl';
import allHallowsEve from './allHallowsEve';
import amy from './amy';
import blackboard from './blackboard';
import cobalt from './cobalt';
import merbivoresoft from './merbivoresoft';
import monokai from './monokai';
import tomorrowNight from './tomorrowNight';
import poimandres from './poimandres';
import gardenOfAtlantis from './gardenOfAtlantis';
import martianNight from './martianNight';
import atomOneDark from './atomOneDark';

export const themes = {
  xstateViz,
  nightowl,
  allHallowsEve,
  amy,
  blackboard,
  cobalt,
  merbivoresoft,
  monokai,
  tomorrowNight,
  poimandres,
  gardenOfAtlantis,
  martianNight,
  atomOneDark,
};
export type ThemeName = keyof typeof themes;
