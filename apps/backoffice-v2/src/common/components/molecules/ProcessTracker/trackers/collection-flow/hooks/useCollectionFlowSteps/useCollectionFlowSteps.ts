import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { getCollectionFlowState } from '@ballerine/common';

interface IUseCollectionFlowStepsParams {
  workflowContext: TWorkflowById['context'];
}

export const useCollectionFlowSteps = ({ workflowContext }: IUseCollectionFlowStepsParams) => {
  const steps = useMemo(() => {
    const collectionFlowState = getCollectionFlowState(workflowContext);

    if (!collectionFlowState?.steps?.length) {
      return [];
    }

    return collectionFlowState.steps;
  }, [workflowContext]);

  return steps;
};
