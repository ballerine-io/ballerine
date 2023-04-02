import { StatePlugin } from '@ballerine/workflow-core';

export type GPTParams = Pick<StatePlugin, 'name' | 'stateNames' | 'when'> & {};
