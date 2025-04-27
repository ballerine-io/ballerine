import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
} from '@ballerine/common';
export const updateStateForEditing = ({
  workflowContext,
  steps,
}: {
  workflowContext: TWorkflowById['context'];
  steps: 'all' | string[];
}) => {
  workflowContext = structuredClone(workflowContext);
  const collectionFlowState = getCollectionFlowState(workflowContext);

  if (!collectionFlowState) {
    throw new Error('Collection flow state not found');
  }

  collectionFlowState.status = CollectionFlowStatusesEnum.edit;
  collectionFlowState.steps = collectionFlowState?.steps?.map(step => {
    if (steps === 'all' || steps.includes(step.stepName)) {
      return {
        ...step,
        state: CollectionFlowStepStatesEnum.edit,
      };
    }

    return step;
  });

  return workflowContext;
};
