import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { CollectionFlowStepStatesEnum, getCollectionFlowState } from '@ballerine/common';

export const checkIfStepInEdit = (stepName: string, context: CollectionFlowContext) => {
  const collectionFlow = getCollectionFlowState(context);

  const step = collectionFlow?.steps?.find(step => step.stepName === stepName);

  return step?.state === CollectionFlowStepStatesEnum.edit;
};
