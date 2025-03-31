import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';
import { useMemo } from 'react';
import { useIsWorkflowStepsCanBeRevised } from '../useIsWorkflowStepsCanBeRevised';

export const useIsCurrentStepCanBeRevised = (
  workflow: TWorkflowById,
  step: TCollectionFlowStep,
) => {
  const isWorkflowStepsCanBeRevised = useIsWorkflowStepsCanBeRevised(workflow);

  const isCurrentStepCanBeRevised = useMemo(() => {
    return [CollectionFlowStepStatesEnum.completed, CollectionFlowStepStatesEnum.revision].includes(
      step.state,
    );
  }, [step.state]);

  return isWorkflowStepsCanBeRevised && isCurrentStepCanBeRevised;
};
