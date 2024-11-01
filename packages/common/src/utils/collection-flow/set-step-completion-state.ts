import { DefaultContextSchema } from '@/schemas';

export interface ISetStepCompletionStateParams {
  stepName: string;
  completed: boolean;
}

export const setStepCompletionState = (
  context: DefaultContextSchema,
  params: ISetStepCompletionStateParams,
) => {
  if (!context.collectionFlow?.state?.steps) {
    throw new Error(
      'Unable to update step completion state: steps array is not initialized in collection flow state',
    );
  }

  const isStepExists = context.collectionFlow.state.steps.find(
    step => step.stepName === params.stepName,
  );

  if (!isStepExists) {
    throw new Error(
      `Unable to update step completion state: step ${params.stepName} is not found in collection flow state`,
    );
  }

  context.collectionFlow.state.steps = context.collectionFlow.state.steps.map(step => {
    if (step.stepName === params.stepName) {
      return {
        ...step,
        isCompleted: params.completed,
      };
    }

    return step;
  });

  return context.collectionFlow.state.steps;
};
