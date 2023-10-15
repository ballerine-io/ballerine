import { AnyObject } from '@ballerine/ui';

export interface FlowConfig {
  apiUrl: string;
  tokenId: string;
  appState: string;
}

export type CollectionFlowContext = Record<string, AnyObject> & { flowConfig?: FlowConfig };
