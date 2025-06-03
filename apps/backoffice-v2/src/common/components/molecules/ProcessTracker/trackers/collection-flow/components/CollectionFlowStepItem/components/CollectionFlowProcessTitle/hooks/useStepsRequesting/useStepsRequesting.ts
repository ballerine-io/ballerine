import { useCollectionFlowStateQuery } from '@/domains/collection-flow/hooks/queries/useCollectionFlowStateQuery/useCollectionFlowStateQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { CollectionFlowStepStatesEnum, StateTag } from '@ballerine/common';
import { useCallback, useMemo } from 'react';

export const useStepsRequesting = (workflow: TWorkflowById) => {
  const { mutate: mutateRevisionCase, isLoading } = useRevisionCaseMutation({});
  const { data: collectionFlowState } = useCollectionFlowStateQuery(workflow?.id);

  const stepsCountToRequest = useMemo(() => {
    const collectionFlowSteps = collectionFlowState?.state?.steps;

    // Preventing rendering steps under revision during Revisions state
    if (!workflow.tags?.includes(StateTag.MANUAL_REVIEW)) {
      return 0;
    }

    return (
      collectionFlowSteps?.filter(step => step.state === CollectionFlowStepStatesEnum.revision)
        .length ?? 0
    );
  }, [collectionFlowState, workflow]);

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
