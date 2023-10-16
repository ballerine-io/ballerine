export interface FlowConfig {
  apiUrl: string;
  tokenId: string;
  appState: string;
}

export type CollectionFlowContext = Record<string, unknown> & {
  flowConfig?: FlowConfig;
};
