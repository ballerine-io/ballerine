import { useMemo } from 'react';
import { useCollectionFlowStateQuery } from '@/domains/collection-flow/hooks/queries/useCollectionFlowStateQuery/useCollectionFlowStateQuery';

interface IUseCollectionFlowStepsParams {
  workflowId: string;
}

export const useCollectionFlowSteps = ({ workflowId }: IUseCollectionFlowStepsParams) => {
  const { data: collectionFlowState, isLoading } = useCollectionFlowStateQuery(workflowId);

  const steps = useMemo(() => {
    return collectionFlowState?.state?.steps || [];
  }, [collectionFlowState]);

  return {
    steps,
    isLoading,
  };
};
