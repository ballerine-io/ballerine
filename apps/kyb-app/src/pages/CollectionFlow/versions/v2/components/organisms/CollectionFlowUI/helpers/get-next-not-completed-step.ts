import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';

export const getNextRevisionOrEditStep = (
  steps: TCollectionFlowStep[],
  currentStep: string,
): TCollectionFlowStep | undefined => {
  const currentStepIndex = steps.findIndex(step => step.stepName === currentStep);
  const startFrom = [...steps].slice(currentStepIndex + 1);
  const nextStepIndex = startFrom.findIndex(step =>
    [CollectionFlowStepStatesEnum.edit, CollectionFlowStepStatesEnum.revision].includes(step.state),
  );

  if (nextStepIndex === -1) return;

  return startFrom[nextStepIndex];
};
