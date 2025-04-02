import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { CollectionFlowStatusesEnum } from './enums/collection-flow-status-enum';
import { CollectionFlowStepStatesEnum } from './enums/collection-flow-step-state-enum';
import { updateCollectionFlowStep } from './update-collection-flow-step';

describe('updateCollectionFlowStep', () => {
  it('should be defined', () => {
    expect(updateCollectionFlowStep).toBeDefined();
  });

  it('should update the specified step in the collection flow', () => {
    // Arrange
    const context = {
      collectionFlow: {
        state: {
          currentStep: 'step1',
          status: CollectionFlowStatusesEnum.pending,
          steps: [
            { stepName: 'step1', isCompleted: false, state: CollectionFlowStepStatesEnum.idle },
            { stepName: 'step2', isCompleted: false, state: CollectionFlowStepStatesEnum.idle },
          ],
        },
      },
    } as DefaultContextSchema;

    const stepName = 'step1';
    const updatePayload = {
      isCompleted: true,
      state: CollectionFlowStepStatesEnum.completed,
    };

    // Act
    const result = updateCollectionFlowStep(context, stepName, updatePayload);

    // Assert
    expect(result.collectionFlow?.state?.steps).toEqual([
      { stepName: 'step1', isCompleted: true, state: CollectionFlowStepStatesEnum.completed },
      { stepName: 'step2', isCompleted: false, state: CollectionFlowStepStatesEnum.idle },
    ]);
  });

  it('should not modify other steps in the collection flow', () => {
    // Arrange
    const context = {
      collectionFlow: {
        state: {
          currentStep: 'step1',
          status: CollectionFlowStatusesEnum.pending,
          steps: [
            { stepName: 'step1', isCompleted: false, state: CollectionFlowStepStatesEnum.idle },
            { stepName: 'step2', isCompleted: false, state: CollectionFlowStepStatesEnum.idle },
            { stepName: 'step3', isCompleted: false, state: CollectionFlowStepStatesEnum.idle },
          ],
        },
      },
    } as DefaultContextSchema;

    const stepName = 'step2';
    const updatePayload = {
      isCompleted: true,
      state: CollectionFlowStepStatesEnum.completed,
      reason: 'Test reason',
    };

    // Act
    const result = updateCollectionFlowStep(context, stepName, updatePayload);

    // Assert
    expect(result.collectionFlow?.state?.steps?.[0]).toEqual({
      stepName: 'step1',
      isCompleted: false,
      state: CollectionFlowStepStatesEnum.idle,
    });
    expect(result.collectionFlow?.state?.steps?.[2]).toEqual({
      stepName: 'step3',
      isCompleted: false,
      state: CollectionFlowStepStatesEnum.idle,
    });
  });

  it('should throw an error if collection flow state is not found', () => {
    // Arrange
    const context = {} as DefaultContextSchema;
    const stepName = 'step1';
    const updatePayload = { isCompleted: true };

    // Act & Assert
    expect(() => updateCollectionFlowStep(context, stepName, updatePayload)).toThrow(
      'Collection flow state not found',
    );
  });

  it('should handle empty steps array', () => {
    // Arrange
    const context = {
      collectionFlow: {
        state: {
          currentStep: '',
          status: CollectionFlowStatusesEnum.pending,
          steps: [],
        },
      },
    } as unknown as DefaultContextSchema;

    const stepName = 'nonexistent';
    const updatePayload = { isCompleted: true };

    // Act
    const result = updateCollectionFlowStep(context, stepName, updatePayload);

    // Assert
    expect(result.collectionFlow?.state?.steps).toEqual([]);
  });
});
