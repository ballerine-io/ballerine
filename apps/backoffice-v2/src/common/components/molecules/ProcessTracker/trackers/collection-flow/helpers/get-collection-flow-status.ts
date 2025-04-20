import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CollectionFlowStepStatesEnum, getCollectionFlowState } from '@ballerine/common';
import { stepStatusToIcon } from '../../../constants';

export const getCollectionFlowStatus = (
  workflowContext: TWorkflowById['context'],
  stepName: string,
) => {
  const collectionFlowState = getCollectionFlowState(workflowContext);
  const stepItem = collectionFlowState?.steps?.find(s => s.stepName === stepName);

  if (!stepItem) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.idle];
  }

  const completedStates = [
    CollectionFlowStepStatesEnum.revised,
    CollectionFlowStepStatesEnum.completed,
  ];

  if (stepItem?.state && completedStates.includes(stepItem?.state)) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.completed];
  }

  if (stepItem?.state === CollectionFlowStepStatesEnum.revision) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.revision];
  }

  if (stepItem?.state === CollectionFlowStepStatesEnum.edit) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.edit];
  }

  return stepStatusToIcon[CollectionFlowStepStatesEnum.inProgress];
};
