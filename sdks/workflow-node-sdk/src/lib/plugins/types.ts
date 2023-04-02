import { StatePlugin } from '@ballerine/workflow-core';
import { StoreAdapter } from '../adapters/types';

export type ModelConfig = {
  model?: string;
};

export type GPTParams = Pick<StatePlugin, 'name' | 'stateNames' | 'when'> & {
  modelConfig: ModelConfig;
};
