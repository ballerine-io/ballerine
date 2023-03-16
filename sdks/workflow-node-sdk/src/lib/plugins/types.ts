import { StatePlugin } from '@ballerine/workflow-core';
import { StoreAdapter } from '../adapters/types';

export type TPersistPluginParams = Pick<StatePlugin, 'name' | 'stateNames' | 'when'> & {
  store: StoreAdapter;
};
