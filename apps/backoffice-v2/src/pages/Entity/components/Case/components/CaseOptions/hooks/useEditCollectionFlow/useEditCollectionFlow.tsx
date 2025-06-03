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
import { useCollectionFlowStateQuery } from '@/domains/collection-flow/hooks/queries/useCollectionFlowStateQuery/useCollectionFlowStateQuery';
import { useUpdateCollectionFlowStateMutation } from '@/domains/collection-flow/hooks/mutations/useUpdateCollectionFlowStateMutation/useUpdateCollectionFlowStateMutation';

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
  const { data: collectionFlowState } = useCollectionFlowStateQuery(workflow?.id || '');
  const { mutateAsync: updateCollectionFlowState } = useUpdateCollectionFlowStateMutation();

  const onEditCollectionFlow = useCallback(
    ({ steps }: { steps: Parameters<typeof updateStateForEditing>[0]['steps'] }) =>
      async () => {
        if (!collectionFlowState || !collectionFlowState.state) {
          toast.error('Something went wrong. Please try again later.');

          return;
        }

        try {
          // Updating case state first to avoid unnecessary collection flow state update in case this step fails
          await editCaseState({ workflowId: workflow?.id || '' });
        } catch (error) {
          toast.error(t('toast:edit_collection_flow_state_transition.error'));
          throw new Error('Failed move to edit collection flow. State missing.');
        }

        const updatedCollectionFlowState = updateStateForEditing({
          collectionFlowState: collectionFlowState.state,
          steps,
        });

        await updateCollectionFlowState({
          workflowId: workflow?.id || '',
          state: updatedCollectionFlowState,
          action: 'step_request',
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
    [updateWorkflowById, editCaseState, workflow, collectionFlowState, updateCollectionFlowState],
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
