import { UIOptions } from '@/domains/collection-flow/types';
import { DefaultContextSchema } from '@ballerine/common';

export type CollectionFlowContext = DefaultContextSchema;

export interface CollectionFlowConfig {
  uiOptions?: UIOptions;
}
export interface CollectionFlowContextData {
  context: CollectionFlowContext;
  config: CollectionFlowConfig;
}
