import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStepStatesEnum,
  TCollectionFlowStep,
  updateCollectionFlowStep,
} from '@ballerine/common';

export const updateStepStateAndReasonInContext = (
  workflow: TWorkflowById,
  step: TCollectionFlowStep,
  state: keyof typeof CollectionFlowStepStatesEnum,
  reason: string | undefined,
) => {
  const context = structuredClone(workflow.context);

  updateCollectionFlowStep(context, step.stepName, {
    state,
    reason,
  });

  return context;
};
