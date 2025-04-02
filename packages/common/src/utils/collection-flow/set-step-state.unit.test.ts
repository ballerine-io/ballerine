import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { CollectionFlowStepStatesEnum } from './enums/collection-flow-step-state-enum';
import { setStepState } from './set-step-state';

describe('setStepCompletionState', () => {
  it('should be defined', () => {
    expect(setStepState).toBeDefined();
  });

  it('should set state for a step', () => {
    const context = {
      collectionFlow: {
        state: {
          steps: [
            {
              stepName: 'step1',
              state: CollectionFlowStepStatesEnum.idle,
            },
          ],
        },
      },
    } as DefaultContextSchema;

    const result = setStepState(context, {
      stepName: 'step1',
      state: CollectionFlowStepStatesEnum.inProgress,
    });

    expect(result).toEqual([{ stepName: 'step1', state: CollectionFlowStepStatesEnum.inProgress }]);
    expect(context.collectionFlow?.state?.steps).toEqual([
      { stepName: 'step1', state: CollectionFlowStepStatesEnum.inProgress },
    ]);
  });

  it('should throw an error if the collection flow state steps are not defined', () => {
    const context = {} as DefaultContextSchema;

    expect(() =>
      setStepState(context, { stepName: 'step1', state: CollectionFlowStepStatesEnum.idle }),
    ).toThrow();
  });
});
