import { CollectionFlowStatuses, TCollectionFlowStatus } from '@/consts';
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
        collectionFlow: { state: { progressBreakdown: {} } },
      } as DefaultContextSchema);

      expect(() => {
        stateHelper.currentStep = 'invalid';
      }).toThrow();
    });
  });

  describe('uiState will update', () => {
    test('if uiState is in progress', () => {
      const stateHelper = new StateHelper({
        collectionFlow: {
          state: {
            currentStep: 'step1',
            progressBreakdown: {
              step1: { isCompleted: false },
              step2: { isCompleted: false },
            } as NonNullable<
              NonNullable<DefaultContextSchema['collectionFlow']>['state']
            >['progressBreakdown'],
          },
        },
      } as DefaultContextSchema);

      stateHelper.currentStep = 'step2';

      expect(stateHelper.currentStep).toBe('step2');
    });
  });

  describe('collectionFlowState', () => {
    describe('will throw on update', () => {
      test('if collectionFlowState is not in DefaultContextSchema', () => {
        const stateHelper = new StateHelper({
          collectionFlow: { state: {} },
        } as DefaultContextSchema);

        expect(() => {
          stateHelper.status = 'invalid' as TCollectionFlowStatus;
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

        stateHelper.status = CollectionFlowStatuses.revision;

        expect(stateHelper.status).toBe('revision');
      });
    });
  });

  describe('override', () => {
    test('will override state', () => {
      const stateHelper = new StateHelper({
        collectionFlow: { state: {} },
      } as DefaultContextSchema);

      stateHelper.override({
        currentStep: 'step1',
        status: CollectionFlowStatuses.revision,
      });

      expect(stateHelper.currentStep).toBe('step1');
      expect(stateHelper.status).toBe(CollectionFlowStatuses.revision);
    });
  });

  describe('setStepCompletionState', () => {
    test('will set step completion state', () => {
      const ctx = {
        collectionFlow: {
          state: {
            progressBreakdown: {
              step1: {
                isCompleted: false,
              },
            } as NonNullable<
              NonNullable<DefaultContextSchema['collectionFlow']>['state']
            >['progressBreakdown'],
          },
        },
      } as DefaultContextSchema;

      const stateHelper = new StateHelper(ctx);

      stateHelper.setStepCompletionState('step1', true);

      expect(ctx.collectionFlow?.state?.progressBreakdown?.step1?.isCompleted).toBe(true);

      stateHelper.setStepCompletionState('step1', false);

      expect(ctx.collectionFlow?.state?.progressBreakdown?.step1?.isCompleted).toBe(false);
    });
  });
});
