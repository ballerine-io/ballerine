import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { setStepCompletionState } from './set-step-completion-state';

describe('setStepCompletionState', () => {
  it('should be defined', () => {
    expect(setStepCompletionState).toBeDefined();
  });

  it('should set the step completion state', () => {
    const context = {
      collectionFlow: {
        state: {
          steps: [
            {
              stepName: 'step1',
              isCompleted: false,
            },
          ],
        },
      },
    } as DefaultContextSchema;

    const result = setStepCompletionState(context, {
      stepName: 'step1',
      completed: true,
    });

    expect(result).toEqual([{ stepName: 'step1', isCompleted: true }]);
    expect(context.collectionFlow?.state?.steps).toEqual([
      { stepName: 'step1', isCompleted: true },
    ]);
  });

  it('should throw an error if the collection flow state steps are not defined', () => {
    const context = {} as DefaultContextSchema;

    expect(() => setStepCompletionState(context, { stepName: 'step1', completed: true })).toThrow();
  });
});
