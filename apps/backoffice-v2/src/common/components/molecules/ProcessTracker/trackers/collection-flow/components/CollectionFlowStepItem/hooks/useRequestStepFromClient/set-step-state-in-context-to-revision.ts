import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStepStatesEnum,
  TCollectionFlowStep,
  updateCollectionFlowStep,
} from '@ballerine/common';

export const updateStepStateAndReasonInContext = (
  context: TWorkflowById['context'],
  step: TCollectionFlowStep,
  state: keyof typeof CollectionFlowStepStatesEnum,
  reason: string | undefined,
) => {
  const contextClone = structuredClone(context);

  updateCollectionFlowStep(contextClone, step.stepName, {
    state,
    reason,
  });

  return contextClone;
};
