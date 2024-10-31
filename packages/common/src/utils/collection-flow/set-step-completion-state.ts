import { DefaultContextSchema } from '@/schemas';

export interface ISetStepCompleteioParams {
  stepName: string;
  completed: boolean;
}

export const setStepCompletionState = (
  context: DefaultContextSchema,
  params: ISetStepCompleteioParams,
) => {
  if (!context.collectionFlow?.state?.steps) {
    throw new Error('Collection flow state steps are not defined');
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
