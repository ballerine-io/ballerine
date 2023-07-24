import { IStep } from '@app/common/hooks/useStepper';
import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';

export const getInitialStepIndexFromContext = (steps: IStep[], context: ViewsData): number => {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const isCompleted =
      context &&
      typeof context.flowData[step.dataAlias] === 'object' &&
      Object.keys(context.flowData[step.dataAlias] as object).length;

    if (isCompleted) continue;

    return i;
  }

  return 0;
};
