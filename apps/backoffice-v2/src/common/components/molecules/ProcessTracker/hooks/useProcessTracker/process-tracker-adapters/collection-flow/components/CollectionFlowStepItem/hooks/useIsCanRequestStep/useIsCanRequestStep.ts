import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';
import { useMemo } from 'react';
import { useIsCanRequestSteps } from '../useIsCanRequestSteps';

export const useIsCanRequestStep = (workflow: TWorkflowById, step: TCollectionFlowStep) => {
  const isCanRequestSteps = useIsCanRequestSteps(workflow);

  const isCanRequestStep = useMemo(() => {
    return [CollectionFlowStepStatesEnum.completed, CollectionFlowStepStatesEnum.revision].includes(
      step.state,
    );
  }, [step.state]);

  return isCanRequestStep && isCanRequestSteps;
};
