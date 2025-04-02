import { DefaultContextSchema } from '@/schemas';
import { getCollectionFlowState } from './get-collection-flow-state';
import { TCollectionFlowStep } from './types';

export const updateCollectionFlowStep = (
  context: DefaultContextSchema,
  stepName: string,
  updatePayload: Omit<TCollectionFlowStep, 'stepName'>,
) => {
  const collectionFlowState = getCollectionFlowState(context);

  if (!collectionFlowState) {
    throw new Error('Collection flow state not found');
  }

  const updatedSteps = collectionFlowState?.steps?.map(step => {
    if (step.stepName === stepName) {
      return { ...step, ...updatePayload };
    }

    return step;
  });

  collectionFlowState.steps = updatedSteps;

  return context;
};
