import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useUpdateWorkflowByIdMutation } from '@/domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { updateStateForEditing } from './helpers/update-state-for-editing';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useEditCaseStateMutation } from './hooks/useEditCaseStateMutation/useEditCaseStateMutation';

interface IUseEditCollectionFlowProps {
  workflowId: string;
  workflowContext: TWorkflowById['context'];
}

export const useEditCollectionFlow = ({
  workflowId,
  workflowContext,
}: IUseEditCollectionFlowProps) => {
  const { mutate: updateWorkflowById, isLoading: isUpdatingWorkflow } =
    useUpdateWorkflowByIdMutation({
      workflowId,
    });
  const { mutateAsync: editCaseState, isLoading: isEditCaseStateLoading } =
    useEditCaseStateMutation();

  const onEditCollectionFlow = useCallback(async () => {
    try {
      const updatedWorkflowContext = updateStateForEditing(workflowContext);

      // Updating case state first to avoid unnecessary context update in case this step fails
      await editCaseState({ workflowId });
      updateWorkflowById({
        context: updatedWorkflowContext,
        action: 'edit_collection_flow',
      });
    } catch (error) {
      console.error(error);
      toast.error('Collection flow missing state.');
    }
  }, [updateWorkflowById, workflowContext, editCaseState, workflowId]);

  return {
    onEditCollectionFlow,
    isLoading: isEditCaseStateLoading || isUpdatingWorkflow,
  };
};
