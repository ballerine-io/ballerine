export interface FlowConfig {
  apiUrl: string;
  tokenId: string;
  appState: string;
  customerCompany: string;
  completedSteps: string[];
}

export type CollectionFlowContext = Record<string, unknown> & {
  flowConfig?: FlowConfig;
};
