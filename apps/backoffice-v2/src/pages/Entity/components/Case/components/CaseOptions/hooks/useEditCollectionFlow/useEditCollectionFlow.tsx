import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useUpdateWorkflowByIdMutation } from '@/domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useEditCaseStateMutation } from './hooks/useEditCaseStateMutation/useEditCaseStateMutation';
import { updateStateForEditing } from './helpers/update-state-for-editing';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useIsCanEditCollectionFlow } from './hooks/useIsCanEditCollectionFlow';

export const useEditCollectionFlow = () => {
  const { data: workflow, isLoading: isLoadingWorkflow } = useCurrentCaseQuery();
  const { mutate: updateWorkflowById, isLoading: isUpdatingWorkflow } =
    useUpdateWorkflowByIdMutation({
      workflowId: workflow?.id || '',
    });
  const { mutateAsync: editCaseState, isLoading: isEditCaseStateLoading } =
    useEditCaseStateMutation();

  const assigneeId = useMemo(
    () => workflow?.assigneeId || workflow?.assignee?.id || '',
    [workflow],
  );
  const tags = useMemo(() => workflow?.tags || [], [workflow]);
  const workflowConfig = useMemo(
    () =>
      workflow?.workflowDefinition.config || ({} as TWorkflowById['workflowDefinition']['config']),
    [workflow],
  );

  const isCanEditCollectionFlow = useIsCanEditCollectionFlow({
    assigneeId,
    tags,
    config: workflowConfig,
  });

  const onEditCollectionFlow = useCallback(async () => {
    try {
      const updatedWorkflowContext = updateStateForEditing(
        workflow?.context || ({} as TWorkflowById['context']),
      );

      // Updating case state first to avoid unnecessary context update in case this step fails
      await editCaseState({ workflowId: workflow?.id || '' });
      updateWorkflowById({
        context: updatedWorkflowContext,
        action: 'edit_collection_flow',
      });
    } catch (error) {
      console.error(error);
      toast.error('Collection flow missing state.');
    }
  }, [updateWorkflowById, editCaseState, workflow]);

  const isLoading = useMemo(
    () => [isEditCaseStateLoading, isUpdatingWorkflow, isLoadingWorkflow].some(Boolean),
    [isEditCaseStateLoading, isUpdatingWorkflow, isLoadingWorkflow],
  );

  return {
    onEditCollectionFlow,
    isCanEditCollectionFlow,
    isLoading,
  };
};
