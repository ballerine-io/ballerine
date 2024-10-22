import { UIOptions } from '@/domains/collection-flow/types';
import { CollectionFlowContextSchema } from '@ballerine/common';

export type CollectionFlowContext = CollectionFlowContextSchema;

export interface CollectionFlowConfig {
  uiOptions?: UIOptions;
}
export interface CollectionFlowContextData {
  context: CollectionFlowContext;
  config: CollectionFlowConfig;
}
