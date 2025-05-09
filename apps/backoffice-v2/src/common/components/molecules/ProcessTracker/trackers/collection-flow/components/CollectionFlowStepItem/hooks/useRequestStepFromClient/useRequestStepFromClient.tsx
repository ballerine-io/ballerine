import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';
import { useCallback } from 'react';
import { updateStepStateAndReasonInContext } from './set-step-state-in-context-to-revision';
import { useUpdateCollectionFlowStateMutation } from '@/domains/collection-flow/hooks/mutations/useUpdateCollectionFlowStateMutation/useUpdateCollectionFlowStateMutation';
import { useCollectionFlowStateQuery } from '@/domains/collection-flow/hooks/queries/useCollectionFlowStateQuery/useCollectionFlowStateQuery';
import { toast } from 'sonner';

export const useRequestStepFromClient = ({
  workflowId,
  context,
  step,
}: {
  workflowId: string;
  context: TWorkflowById['context'];
  step: TCollectionFlowStep;
}) => {
  const { data: collectionFlowState } = useCollectionFlowStateQuery(workflowId);
  const { isLoading, mutate: updateCollectionFlowState } = useUpdateCollectionFlowStateMutation();

  const onRequestStepFromClient = useCallback(
    (reason: string) => {
      if (!collectionFlowState?.state) {
        console.log('Collection flow state is missing during step request.');
        toast.error('Something went wrong. Please try again later.');

        return;
      }

      const updatedContext = updateStepStateAndReasonInContext(
        collectionFlowState.state,
        step,
        CollectionFlowStepStatesEnum.revision,
        reason,
      );

      updateCollectionFlowState({
        workflowId,
        state: updatedContext,
        action: 'step_request',
      });
    },
    [updateCollectionFlowState, context, step, workflowId],
  );

  const onCancelStepRequest = useCallback(() => {
    if (!collectionFlowState?.state) {
      console.log('Collection flow state is missing during step request cancellation.');
      toast.error('Something went wrong. Please try again later.');

      return;
    }

    const updatedContext = updateStepStateAndReasonInContext(
      collectionFlowState.state,
      step,
      CollectionFlowStepStatesEnum.completed,
      undefined,
    );

    updateCollectionFlowState({
      workflowId,
      state: updatedContext,
      action: 'step_cancel',
    });
  }, [updateCollectionFlowState, step, workflowId]);

  return { onRequestStepFromClient, onCancelStepRequest, isLoading };
};
