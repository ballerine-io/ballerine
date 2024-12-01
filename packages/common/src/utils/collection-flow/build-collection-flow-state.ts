import { CollectionFlowStatusesEnum } from './enums/collection-flow-status-enum';
import { TCollectionFlowConfig } from './schemas/config-schema';
import { TCollectionFlow } from './types';
import { isCollectionFlowInputConfigValid } from './validators';

const initializeConfig = (inputConfig: TCollectionFlowConfig): TCollectionFlow['config'] => {
  if (!isCollectionFlowInputConfigValid(inputConfig)) {
    throw new Error('Invalid collection flow config');
  }

  return {
    apiUrl: inputConfig.apiUrl,
  };
};

const initializeState = (inputConfig: TCollectionFlowConfig): TCollectionFlow['state'] => {
  const buildProgress = (steps: TCollectionFlowConfig['steps']) => {
    const progressState = steps.map(step => ({
      stepName: step.stateName,
      isCompleted: false,
    }));

    console.log('Collection Flow Context built progress state: ', progressState);

    return progressState;
  };

  return {
    currentStep: inputConfig?.steps[0]?.stateName || '',
    status: CollectionFlowStatusesEnum.pending,
    steps: buildProgress(inputConfig.steps || []),
  };
};

export const buildCollectionFlowState = (inputConfig: TCollectionFlowConfig): TCollectionFlow => {
  const config: TCollectionFlow['config'] = initializeConfig(inputConfig);
  const state: TCollectionFlow['state'] = initializeState(inputConfig);

  const collectionFlow: TCollectionFlow = {
    config,
    state,
    additionalInformation: inputConfig.additionalInformation || {},
  };

  return collectionFlow;
};
