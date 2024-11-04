import { describe, expect, it, test } from 'vitest';
import { buildCollectionFlowState } from './build-collection-flow-state';
import { CollectionFlowStatusesEnum } from './enums/collection-flow-status-enum';
import { TCollectionFlowConfig } from './schemas/config-schema';

describe('buildCollectionFlowState', () => {
  it('should be defined', () => {
    expect(buildCollectionFlowState).toBeDefined();
  });

  describe('when the config is valid', () => {
    test.each([
      [
        {
          apiUrl: 'https://api.example.com',
          steps: [],
        },
        {
          config: {
            apiUrl: 'https://api.example.com',
          },
          state: {
            currentStep: '',
            status: CollectionFlowStatusesEnum.pending,
            steps: [],
          },
          additionalInformation: {},
        },
      ],
      [
        {
          apiUrl: 'https://api.example.com',
          steps: [{ stateName: 'step1' }, { stateName: 'step2' }],
          additionalInformation: {
            customerCompany: 'Example Company',
          },
        },
        {
          config: {
            apiUrl: 'https://api.example.com',
          },
          state: {
            currentStep: 'step1',
            status: CollectionFlowStatusesEnum.pending,
            steps: [
              { stepName: 'step1', isCompleted: false },
              { stepName: 'step2', isCompleted: false },
            ],
          },
          additionalInformation: { customerCompany: 'Example Company' },
        },
      ],
    ])('should build the collection flow state', (config, expected) => {
      const collectionFlowState = buildCollectionFlowState(config);

      expect(collectionFlowState).toEqual(expected);
    });
  });

  describe('when the config is invalid', () => {
    it('should throw an error', () => {
      expect(() => buildCollectionFlowState({} as TCollectionFlowConfig)).toThrow();
    });
  });
});
