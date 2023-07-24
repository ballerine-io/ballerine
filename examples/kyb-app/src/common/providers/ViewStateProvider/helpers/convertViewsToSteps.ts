import { IStep } from '@app/common/hooks/useStepper';
import { View } from '@app/common/providers/ViewStateProvider/types';

export const convertViewsToSteps = (views: View[]): IStep[] => {
  return views.map((view, index) => ({
    index,
    label: view.label,
    dataAlias: view.key,
    meta: view.meta,
  }));
};
