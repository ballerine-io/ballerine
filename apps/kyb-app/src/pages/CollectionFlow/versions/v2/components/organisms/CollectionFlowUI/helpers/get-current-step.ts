import { TCollectionFlowStep } from '@ballerine/common';

export const getCurrentStep = (
  steps: TCollectionFlowStep[],
  currentStep: string,
): TCollectionFlowStep | undefined => {
  return steps.find(step => step.stepName === currentStep);
};
