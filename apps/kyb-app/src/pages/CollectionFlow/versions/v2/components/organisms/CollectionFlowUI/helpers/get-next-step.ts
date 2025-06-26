import { TCollectionFlowStep } from '@ballerine/common';

export const getNextStep = (
  steps: TCollectionFlowStep[],
  currentStep: string,
): TCollectionFlowStep | undefined => {
  const currentStepIndex = steps.findIndex(step => step.stepName === currentStep);
  const nextStep = steps[currentStepIndex + 1];

  return nextStep;
};
