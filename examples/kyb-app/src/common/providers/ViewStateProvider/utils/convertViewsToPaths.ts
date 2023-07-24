import { Views } from '@app/common/providers/ViewStateProvider/components/ViewResolver/types';
import { View } from '@app/common/providers/ViewStateProvider/types';

export const convertViewsToPaths = (views: View[]): Views<string> => {
  return views.reduce((views, view) => {
    views[view.key] = view.Component;

    return views;
  }, {});
};
