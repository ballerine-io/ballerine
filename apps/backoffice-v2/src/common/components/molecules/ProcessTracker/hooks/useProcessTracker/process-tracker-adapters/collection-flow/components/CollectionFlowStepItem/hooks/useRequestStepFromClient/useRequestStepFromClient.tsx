import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useUpdateWorkflowByIdMutation } from '@/domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';
import { useCallback } from 'react';
import { updateStepStateAndReasonInContext } from './set-step-state-in-context-to-revision';

export const useRequestStepFromClient = ({
  workflow,
  step,
}: {
  workflow: TWorkflowById;
  step: TCollectionFlowStep;
}) => {
  const { isLoading, mutate: updateWorkflowById } = useUpdateWorkflowByIdMutation({
    workflowId: workflow.id,
  });

  const onRequestStepFromClient = useCallback(
    (reason: string) => {
      const updatedContext = updateStepStateAndReasonInContext(
        workflow,
        step,
        CollectionFlowStepStatesEnum.revision,
        reason,
      );

      updateWorkflowById({
        context: updatedContext,
        action: 'step_request',
      });
    },
    [updateWorkflowById, workflow, step],
  );

  const onCancelStepRequest = useCallback(() => {
    const updatedContext = updateStepStateAndReasonInContext(
      workflow,
      step,
      CollectionFlowStepStatesEnum.completed,
      undefined,
    );

    updateWorkflowById({
      context: updatedContext,
      action: 'step_cancel',
    });
  }, [workflow, step, updateWorkflowById]);

  return { onRequestStepFromClient, onCancelStepRequest, isLoading };
};
