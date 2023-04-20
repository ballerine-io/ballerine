import { StatePlugin } from '@ballerine/workflow-core';
import { StoreAdapter } from '../adapters/types';

export type ModelConfig = {
  model?: string;
  max_tokens?: number;
  n?: number;
  temperature?: number;
};
export type PromptConfig = {
  // plugin user can provide a custom prompt or a job
  prompt?: string;
  jobName?: 'match_names' | 'busniess_details_by_web_presence';
  responseSchema?: Object; // should be json schema eventually
  contextFliter?: Object; // It will be define what part of the context will be passed into the prompt as prompt data
};

export type GPTParams = Pick<StatePlugin, 'name' | 'stateNames' | 'when'> & {
  modelConfig: ModelConfig;
  promptConfig: PromptConfig;
};
