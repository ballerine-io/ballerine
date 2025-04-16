import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
} from '@ballerine/common';
import { toast } from 'sonner';
import { t } from 'i18next';
export const updateStateForEditing = ({
  workflowContext,
  steps,
}: {
  workflowContext: TWorkflowById['context'];
  steps: 'all' | string[];
}) => {
  workflowContext = structuredClone(workflowContext);
  const collectionFlowState = getCollectionFlowState(workflowContext);
  const stepsToUpdate =
    steps === 'all'
      ? collectionFlowState?.steps
      : collectionFlowState?.steps?.filter(step => steps.includes(step.stepName));

  if (!stepsToUpdate?.length) {
    toast.error(t('toast:edit_collection_flow.error'));

    throw new Error(`Invalid steps to update provided: "${JSON.stringify(steps)}"`);
  }

  if (!collectionFlowState) {
    throw new Error('Collection flow state not found');
  }

  collectionFlowState.status = CollectionFlowStatusesEnum.edit;
  collectionFlowState.steps = stepsToUpdate?.map(step => ({
    ...step,
    state: CollectionFlowStepStatesEnum.edit,
  }));

  return workflowContext;
};
