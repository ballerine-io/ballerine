import { CollectionFlowStates, TCollectionFlowState } from '@/consts';
import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it, test } from 'vitest';
import { StateHelper } from './state-helper';

describe('StateHelper', () => {
  it('should be defined', () => {
    const stateHelper = new StateHelper({
      collectionFlow: { state: {} },
    } as DefaultContextSchema);

    expect(stateHelper).toBeDefined();
  });

  describe('state helper will throw', () => {
    test('if state in context is missing', () => {
      expect(() => new StateHelper({} as DefaultContextSchema)).toThrow();
    });
  });

  describe('uiState will throw on update', () => {
    test('if uiState is not in progress', () => {
      const stateHelper = new StateHelper({
        collectionFlow: { state: { progress: {} } },
      } as DefaultContextSchema);

      expect(() => {
        stateHelper.uiState = 'invalid';
      }).toThrow();
    });
  });

  describe('uiState will update', () => {
    test('if uiState is in progress', () => {
      const stateHelper = new StateHelper({
        collectionFlow: {
          state: {
            uiState: 'step1',
            progress: {
              step1: { isCompleted: false },
              step2: { isCompleted: false },
            } as NonNullable<
              NonNullable<DefaultContextSchema['collectionFlow']>['state']
            >['progress'],
          },
        },
      } as DefaultContextSchema);

      stateHelper.uiState = 'step2';

      expect(stateHelper.uiState).toBe('step2');
    });
  });

  describe('collectionFlowState', () => {
    describe('will throw on update', () => {
      test('if collectionFlowState is not in DefaultContextSchema', () => {
        const stateHelper = new StateHelper({
          collectionFlow: { state: {} },
        } as DefaultContextSchema);

        expect(() => {
          stateHelper.collectionFlowState = 'invalid' as TCollectionFlowState;
        }).toThrow();
      });
    });

    describe('will update', () => {
      test('if collectionFlowState is in DefaultContextSchema', () => {
        const stateHelper = new StateHelper({
          collectionFlow: {
            state: {},
          },
        } as DefaultContextSchema);

        stateHelper.collectionFlowState = CollectionFlowStates.revision;

        expect(stateHelper.collectionFlowState).toBe('revision');
      });
    });
  });

  describe('override', () => {
    test('will override state', () => {
      const stateHelper = new StateHelper({
        collectionFlow: { state: {} },
      } as DefaultContextSchema);

      stateHelper.override({
        uiState: 'step1',
        collectionFlowState: CollectionFlowStates.revision,
      });

      expect(stateHelper.uiState).toBe('step1');
      expect(stateHelper.collectionFlowState).toBe(CollectionFlowStates.revision);
    });
  });

  describe('setStepCompletionState', () => {
    test('will set step completion state', () => {
      const ctx = {
        collectionFlow: {
          state: {
            progress: {
              step1: {
                isCompleted: false,
              },
            } as NonNullable<
              NonNullable<DefaultContextSchema['collectionFlow']>['state']
            >['progress'],
          },
        },
      } as DefaultContextSchema;

      const stateHelper = new StateHelper(ctx);

      stateHelper.setStepCompletionState('step1', true);

      expect(ctx.collectionFlow?.state?.progress?.step1?.isCompleted).toBe(true);

      stateHelper.setStepCompletionState('step1', false);

      expect(ctx.collectionFlow?.state?.progress?.step1?.isCompleted).toBe(false);
    });
  });
});
