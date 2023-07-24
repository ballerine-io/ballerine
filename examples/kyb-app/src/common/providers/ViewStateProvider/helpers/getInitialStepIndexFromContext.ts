import { IStep } from '@app/common/hooks/useStepper';
import { AnyObject } from '@ballerine/ui';

export const getInitialStepIndexFromContext = (steps: IStep[], context: AnyObject): number => {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const isCompleted =
      typeof context[step.dataAlias] === 'object' &&
      Object.keys(context[step.dataAlias] as object).length;

    if (isCompleted) continue;

    return i;
  }

  return 0;
};
