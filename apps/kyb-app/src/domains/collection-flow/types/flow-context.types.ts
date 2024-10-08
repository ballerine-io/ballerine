import { UIOptions } from '@/domains/collection-flow/types';

export interface FlowConfig {
  apiUrl: string;
  tokenId: string;
  appState: string;
  customerCompany: string;
  stepsProgress?: Record<string, { isCompleted: boolean }>;
}

export type CollectionFlowContext = Record<string, unknown> & {
  flowConfig?: FlowConfig;
};

export interface CollectionFlowConfig {
  uiOptions?: UIOptions;
}
export interface CollectionFlowContextData {
  context: CollectionFlowContext;
  config: CollectionFlowConfig;
}
