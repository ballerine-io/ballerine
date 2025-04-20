import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useUpdateWorkflowByIdMutation } from '@/domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';
import { useCallback } from 'react';
import { updateStepStateAndReasonInContext } from './set-step-state-in-context-to-revision';

export const useRequestStepFromClient = ({
  workflowId,
  context,
  step,
}: {
  workflowId: string;
  context: TWorkflowById['context'];
  step: TCollectionFlowStep;
}) => {
  const { isLoading, mutate: updateWorkflowById } = useUpdateWorkflowByIdMutation({
    workflowId,
  });

  const onRequestStepFromClient = useCallback(
    (reason: string) => {
      const updatedContext = updateStepStateAndReasonInContext(
        context,
        step,
        CollectionFlowStepStatesEnum.revision,
        reason,
      );

      updateWorkflowById({
        context: updatedContext,
        action: 'step_request',
      });
    },
    [updateWorkflowById, context, step],
  );

  const onCancelStepRequest = useCallback(() => {
    const updatedContext = updateStepStateAndReasonInContext(
      context,
      step,
      CollectionFlowStepStatesEnum.completed,
      undefined,
    );

    updateWorkflowById({
      context: updatedContext,
      action: 'step_cancel',
    });
  }, [context, step, updateWorkflowById]);

  return { onRequestStepFromClient, onCancelStepRequest, isLoading };
};
