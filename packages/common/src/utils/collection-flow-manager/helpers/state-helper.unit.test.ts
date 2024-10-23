import { CollectionFlowContextSchema } from '@/schemas';
import { CollectionFlowStateEnum } from '@/schemas/documents/collection-flow-context-schema';
import { describe, expect, it, test } from 'vitest';
import { StateHelper } from './state-helper';

describe('StateHelper', () => {
  it('should be defined', () => {
    const stateHelper = new StateHelper({
      collectionFlow: { state: {} },
    } as CollectionFlowContextSchema);

    expect(stateHelper).toBeDefined();
  });

  describe('state helper will throw', () => {
    test('if state in context is missing', () => {
      expect(() => new StateHelper({} as CollectionFlowContextSchema)).toThrow();
    });
  });

  describe('uiState will throw on update', () => {
    test('if uiState is not in progress', () => {
      const stateHelper = new StateHelper({
        collectionFlow: { state: { progress: {} } },
      } as CollectionFlowContextSchema);

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
              NonNullable<CollectionFlowContextSchema['collectionFlow']>['state']
            >['progress'],
          },
        },
      } as CollectionFlowContextSchema);

      stateHelper.uiState = 'step2';

      expect(stateHelper.uiState).toBe('step2');
    });
  });

  describe('collectionFlowState', () => {
    describe('will throw on update', () => {
      test('if collectionFlowState is not in CollectionFlowStateEnum', () => {
        const stateHelper = new StateHelper({
          collectionFlow: { state: {} },
        } as CollectionFlowContextSchema);

        expect(() => {
          stateHelper.collectionFlowState = 'invalid' as CollectionFlowStateEnum;
        }).toThrow();
      });
    });

    describe('will update', () => {
      test('if collectionFlowState is in CollectionFlowStateEnum', () => {
        const stateHelper = new StateHelper({
          collectionFlow: {
            state: {},
          },
        } as CollectionFlowContextSchema);

        stateHelper.collectionFlowState = CollectionFlowStateEnum.revision;

        expect(stateHelper.collectionFlowState).toBe('revision');
      });
    });
  });

  describe('override', () => {
    test('will override state', () => {
      const stateHelper = new StateHelper({
        collectionFlow: { state: {} },
      } as CollectionFlowContextSchema);

      stateHelper.override({
        uiState: 'step1',
        collectionFlowState: CollectionFlowStateEnum.revision,
      });

      expect(stateHelper.uiState).toBe('step1');
      expect(stateHelper.collectionFlowState).toBe(CollectionFlowStateEnum.revision);
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
              NonNullable<CollectionFlowContextSchema['collectionFlow']>['state']
            >['progress'],
          },
        },
      } as CollectionFlowContextSchema;

      const stateHelper = new StateHelper(ctx);

      stateHelper.setStepCompletionState('step1', true);

      expect(ctx.collectionFlow?.state?.progress?.step1?.isCompleted).toBe(true);

      stateHelper.setStepCompletionState('step1', false);

      expect(ctx.collectionFlow?.state?.progress?.step1?.isCompleted).toBe(false);
    });
  });
});
