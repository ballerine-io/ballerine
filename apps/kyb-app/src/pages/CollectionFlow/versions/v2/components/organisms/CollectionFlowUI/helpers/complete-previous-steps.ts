import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';

export const completePreviousSteps = (steps: TCollectionFlowStep[], currentStep: string) => {
  const currentStepIndex = steps.findIndex(step => step.stepName === currentStep);

  if (currentStepIndex === 0 || currentStepIndex === -1) {
    return steps;
  }

  const previousSteps = [...steps].slice(0, currentStepIndex);

  previousSteps.forEach(step => {
    step.state = CollectionFlowStepStatesEnum.completed;
  });

  return steps;
};
