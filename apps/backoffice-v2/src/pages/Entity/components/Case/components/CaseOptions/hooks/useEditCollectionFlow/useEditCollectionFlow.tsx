import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useUpdateWorkflowByIdMutation } from '@/domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { buildCollectionFlowUrl } from '@ballerine/common';
import { t } from 'i18next';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { updateStateForEditing } from './helpers/update-state-for-editing';
import { useEditCaseStateMutation } from './hooks/useEditCaseStateMutation/useEditCaseStateMutation';
import { useIsCanEditCollectionFlow } from './hooks/useIsCanEditCollectionFlow';

export const useEditCollectionFlow = () => {
  const { data: workflow, isLoading: isLoadingWorkflow } = useCurrentCaseQuery();
  const { mutateAsync: updateWorkflowById, isLoading: isUpdatingWorkflow } =
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

  const onEditCollectionFlow = useCallback(
    ({ steps }: { steps: Parameters<typeof updateStateForEditing>[0]['steps'] }) =>
      async () => {
        const updatedWorkflowContext = updateStateForEditing({
          workflowContext: workflow?.context || ({} as TWorkflowById['context']),
          steps,
        });

        try {
          // Updating case state first to avoid unnecessary context update in case this step fails
          await editCaseState({ workflowId: workflow?.id || '' });
        } catch (error) {
          toast.error(t('toast:edit_collection_flow_state_transition.error'));
          throw new Error('Failed move to edit collection flow. State missing.');
        }

        await updateWorkflowById({
          context: updatedWorkflowContext,
          action: 'edit_collection_flow',
        });

        try {
          const collectionFlowBaseUrl = (workflow as TWorkflowById)?.context?.metadata
            ?.collectionFlowUrl;

          if (!collectionFlowBaseUrl) {
            throw new Error('Collection flow URL is missing.');
          }

          const url = buildCollectionFlowUrl(collectionFlowBaseUrl, {
            workflowId: workflow?.id,
          });

          window.open(url, '_blank');
        } catch (error) {
          toast.error(t('toast:edit_collection_flow.error_opening_collection_flow'));
          throw new Error('Failed to open collection flow in new tab.');
        }
      },
    [updateWorkflowById, editCaseState, workflow],
  );

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
