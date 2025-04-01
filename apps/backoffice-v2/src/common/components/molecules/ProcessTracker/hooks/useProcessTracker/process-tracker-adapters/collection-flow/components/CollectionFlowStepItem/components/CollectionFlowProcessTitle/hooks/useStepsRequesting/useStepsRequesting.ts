import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { CollectionFlowStepStatesEnum, getCollectionFlowState } from '@ballerine/common';
import { useCallback, useMemo } from 'react';

export const useStepsRequesting = (workflow: TWorkflowById) => {
  const { mutate: mutateRevisionCase, isLoading } = useRevisionCaseMutation({});

  const stepsCountToRequest = useMemo(() => {
    const collectionFlowSteps = getCollectionFlowState(workflow?.context || {})?.steps;

    return (
      collectionFlowSteps?.filter(step => step.state === CollectionFlowStepStatesEnum.revision)
        .length ?? 0
    );
  }, [workflow]);

  const sendRequestedStepsToRevision = useCallback(() => {
    mutateRevisionCase({
      workflowId: workflow?.id,
    });
  }, [mutateRevisionCase, workflow]);

  return {
    stepsCountToRequest,
    isLoading,
    sendRequestedStepsToRevision,
  };
};
