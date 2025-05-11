import { TCollectionFlowState } from '@/domains/collection-flow/schemas';
import {
  CollectionFlowStepStatesEnum,
  TCollectionFlowStep,
  updateCollectionFlowStep,
} from '@ballerine/common';

export const updateStepStateAndReasonInContext = (
  collectionFlowState: TCollectionFlowState,
  step: TCollectionFlowStep,
  state: keyof typeof CollectionFlowStepStatesEnum,
  reason: string | undefined,
) => {
  const stateClone = structuredClone(collectionFlowState);

  updateCollectionFlowStep(
    {
      collectionFlow: {
        state: stateClone,
      },
    },
    step.stepName,
    {
      state,
      reason,
    },
  );

  return stateClone;
};
