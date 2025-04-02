import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { CollectionFlowStepStatesEnum, getCollectionFlowState } from '@ballerine/common';

export const checkIfStepInRevision = (stepName: string, context: CollectionFlowContext) => {
  const collectionFlow = getCollectionFlowState(context);

  const step = collectionFlow?.steps?.find(step => step.stepName === stepName);

  if (!step) {
    return false;
  }

  return step.state === CollectionFlowStepStatesEnum.revision;
};
